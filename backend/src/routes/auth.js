const express = require('express');
const passport = require('passport');
const SteamStrategy = require('passport-steam').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');
const emailService = require('../services/emailService');
const { generateTokens, verifyRefreshToken } = require('../utils/tokenUtils');

const router = express.Router();

// Rate limiting específico para autenticação
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas por IP
  message: {
    error: 'Muitas tentativas de login. Tente novamente em 15 minutos.',
    code: 'AUTH_RATE_LIMIT_EXCEEDED'
  }
});

// Configurar Passport Steam Strategy
passport.use(new SteamStrategy({
    returnURL: process.env.STEAM_RETURN_URL || 'http://localhost:8000/api/v1/auth/steam/return',
    realm: process.env.STEAM_REALM || 'http://localhost:8000',
    apiKey: process.env.STEAM_API_KEY
  },
  async (identifier, profile, done) => {
    try {
      const steamId = profile.id;
      const prisma = require('@prisma/client').PrismaClient;
      const db = new prisma();
      
      // Buscar usuário existente
      let user = await db.user.findUnique({
        where: { steamId }
      });
      
      if (!user) {
        // Criar novo usuário
        user = await db.user.create({
          data: {
            steamId,
            username: profile.displayName || `player_${steamId.slice(-8)}`,
            displayName: profile.displayName,
            avatar: profile.photos?.[2]?.value || profile.photos?.[1]?.value || profile.photos?.[0]?.value,
            country: profile._json?.loccountrycode,
            isVerified: true,
            lastLogin: new Date()
          }
        });
        
        logger.info(`Novo usuário criado via Steam: ${user.id}`);
      } else {
        // Atualizar último login e dados do perfil
        user = await db.user.update({
          where: { id: user.id },
          data: {
            displayName: profile.displayName,
            avatar: profile.photos?.[2]?.value || profile.photos?.[1]?.value || profile.photos?.[0]?.value,
            lastLogin: new Date()
          }
        });
      }
      
      await db.$disconnect();
      return done(null, user);
    } catch (error) {
      logger.error('Erro na autenticação Steam:', error);
      return done(error, null);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const prisma = require('@prisma/client').PrismaClient;
    const db = new prisma();
    const user = await db.user.findUnique({ where: { id } });
    await db.$disconnect();
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Inicializar Passport
router.use(passport.initialize());

// Rota para iniciar autenticação Steam
router.get('/steam', passport.authenticate('steam', { failureRedirect: '/login' }));

// Callback do Steam
router.get('/steam/return', 
  passport.authenticate('steam', { failureRedirect: '/login' }),
  async (req, res) => {
    try {
      const user = req.user;
      
      // Gerar tokens JWT
      const { accessToken, refreshToken } = generateTokens(user);
      
      // Salvar refresh token no banco
      await req.prisma.user.update({
        where: { id: user.id },
        data: {
          // Você pode adicionar um campo refreshToken se necessário
        }
      });
      
      // Redirecionar para o frontend com tokens
      const frontendUrl = process.env.CORS_ORIGIN || 'http://localhost:3000';
      res.redirect(`${frontendUrl}/auth/success?token=${accessToken}&refresh=${refreshToken}`);
      
    } catch (error) {
      logger.error('Erro no callback Steam:', error);
      res.redirect(`${process.env.CORS_ORIGIN}/auth/error`);
    }
  }
);

// Registro por email
router.post('/register', 
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('username').isLength({ min: 3, max: 20 }).matches(/^[a-zA-Z0-9_]+$/),
    body('password').isLength({ min: 6 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: errors.array()
        });
      }
      
      const { email, username, password } = req.body;
      
      // Verificar se usuário já existe
      const existingUser = await req.prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      });
      
      if (existingUser) {
        return res.status(409).json({
          error: 'Email ou username já está em uso',
          code: 'USER_ALREADY_EXISTS'
        });
      }
      
      // Hash da senha
      const hashedPassword = await bcrypt.hash(password, 12);
      
      // Criar usuário
      const user = await req.prisma.user.create({
        data: {
          email,
          username,
          password: hashedPassword,
          isVerified: false
        }
      });
      
      // Enviar email de verificação
      await emailService.sendVerificationEmail(user.email, user.id);
      
      logger.info(`Novo usuário registrado: ${user.id}`);
      
      res.status(201).json({
        message: 'Usuário criado com sucesso. Verifique seu email.',
        userId: user.id
      });
      
    } catch (error) {
      logger.error('Erro no registro:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
);

// Login por email
router.post('/login',
  authLimiter,
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: errors.array()
        });
      }
      
      const { email, password } = req.body;
      
      // Buscar usuário
      const user = await req.prisma.user.findUnique({
        where: { email }
      });
      
      if (!user || !user.password) {
        return res.status(401).json({
          error: 'Credenciais inválidas',
          code: 'INVALID_CREDENTIALS'
        });
      }
      
      // Verificar senha
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Credenciais inválidas',
          code: 'INVALID_CREDENTIALS'
        });
      }
      
      // Verificar se usuário está banido
      if (user.isBanned) {
        return res.status(403).json({
          error: 'Conta banida',
          code: 'ACCOUNT_BANNED',
          reason: user.banReason,
          expiresAt: user.banExpiresAt
        });
      }
      
      // Atualizar último login
      await req.prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      });
      
      // Gerar tokens
      const { accessToken, refreshToken } = generateTokens(user);
      
      logger.info(`Login realizado: ${user.id}`);
      
      res.json({
        message: 'Login realizado com sucesso',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
          balance: user.balance,
          level: user.level,
          rank: user.rank
        },
        tokens: {
          accessToken,
          refreshToken
        }
      });
      
    } catch (error) {
      logger.error('Erro no login:', error);
      res.status(500).json({
        error: 'Erro interno do servidor',
        code: 'INTERNAL_SERVER_ERROR'
      });
    }
  }
);

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        error: 'Refresh token necessário',
        code: 'REFRESH_TOKEN_REQUIRED'
      });
    }
    
    const decoded = verifyRefreshToken(refreshToken);
    
    // Buscar usuário
    const user = await req.prisma.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user || user.isBanned) {
      return res.status(401).json({
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }
    
    // Gerar novos tokens
    const tokens = generateTokens(user);
    
    res.json({
      tokens
    });
    
  } catch (error) {
    logger.error('Erro no refresh token:', error);
    res.status(401).json({
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
});

// Verificar email
router.get('/verify/:token', async (req, res) => {
  try {
    const { token } = req.params;
    
    // Decodificar token de verificação
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Atualizar usuário
    await req.prisma.user.update({
      where: { id: decoded.userId },
      data: { isVerified: true }
    });
    
    logger.info(`Email verificado: ${decoded.userId}`);
    
    res.json({
      message: 'Email verificado com sucesso'
    });
    
  } catch (error) {
    logger.error('Erro na verificação de email:', error);
    res.status(400).json({
      error: 'Token de verificação inválido',
      code: 'INVALID_VERIFICATION_TOKEN'
    });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  try {
    // Aqui você pode invalidar o refresh token se estiver armazenando
    res.json({
      message: 'Logout realizado com sucesso'
    });
  } catch (error) {
    logger.error('Erro no logout:', error);
    res.status(500).json({
      error: 'Erro interno do servidor'
    });
  }
});

// Verificar status de autenticação
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        error: 'Token não fornecido',
        code: 'TOKEN_REQUIRED'
      });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await req.prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        balance: true,
        level: true,
        xp: true,
        rank: true,
        isVerified: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(401).json({
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND'
      });
    }
    
    res.json({ user });
    
  } catch (error) {
    logger.error('Erro ao verificar autenticação:', error);
    res.status(401).json({
      error: 'Token inválido',
      code: 'INVALID_TOKEN'
    });
  }
});

module.exports = router;