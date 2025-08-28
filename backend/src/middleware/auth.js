const jwt = require('jsonwebtoken');
const { verifyAccessToken, extractTokenFromHeader } = require('../utils/tokenUtils');
const { logger, logAuth, logSecurity } = require('../utils/logger');
const rateLimit = require('express-rate-limit');

/**
 * Middleware de autenticação principal
 * Verifica se o usuário está autenticado via JWT
 */
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      logSecurity('MISSING_TOKEN', 'low', {
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        path: req.path
      });
      
      return res.status(401).json({
        error: 'Token de acesso necessário',
        code: 'TOKEN_REQUIRED'
      });
    }
    
    // Verificar e decodificar token
    const decoded = verifyAccessToken(token);
    
    // Buscar usuário no banco de dados
    const user = await req.prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
        isBanned: true,
        banReason: true,
        banExpiresAt: true,
        balance: true,
        level: true,
        xp: true
      }
    });
    
    if (!user) {
      logSecurity('USER_NOT_FOUND', 'medium', {
        userId: decoded.userId,
        ip: req.ip,
        path: req.path
      });
      
      return res.status(401).json({
        error: 'Usuário não encontrado',
        code: 'USER_NOT_FOUND'
      });
    }
    
    // Verificar se usuário está banido
    if (user.isBanned) {
      const now = new Date();
      if (!user.banExpiresAt || user.banExpiresAt > now) {
        logSecurity('BANNED_USER_ACCESS', 'high', {
          userId: user.id,
          banReason: user.banReason,
          ip: req.ip,
          path: req.path
        });
        
        return res.status(403).json({
          error: 'Conta banida',
          code: 'ACCOUNT_BANNED',
          reason: user.banReason,
          expiresAt: user.banExpiresAt
        });
      } else {
        // Ban expirou, remover ban
        await req.prisma.user.update({
          where: { id: user.id },
          data: {
            isBanned: false,
            banReason: null,
            banExpiresAt: null
          }
        });
        user.isBanned = false;
      }
    }
    
    // Adicionar usuário ao request
    req.user = user;
    req.token = token;
    
    // Log de acesso bem-sucedido
    logAuth('ACCESS_GRANTED', user.id, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path
    });
    
    next();
    
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      logSecurity('INVALID_TOKEN', 'medium', {
        error: error.message,
        ip: req.ip,
        path: req.path
      });
      
      return res.status(401).json({
        error: 'Token inválido',
        code: 'INVALID_TOKEN'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      logSecurity('EXPIRED_TOKEN', 'low', {
        ip: req.ip,
        path: req.path
      });
      
      return res.status(401).json({
        error: 'Token expirado',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    logger.error('Erro na autenticação:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
};

/**
 * Middleware de autenticação opcional
 * Adiciona informações do usuário se autenticado, mas não bloqueia se não estiver
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return next();
    }
    
    const decoded = verifyAccessToken(token);
    const user = await req.prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isVerified: true,
        isBanned: true
      }
    });
    
    if (user && !user.isBanned) {
      req.user = user;
      req.token = token;
    }
    
    next();
    
  } catch (error) {
    // Em caso de erro, continuar sem autenticação
    next();
  }
};

/**
 * Middleware para verificar se o usuário tem uma role específica
 */
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Autenticação necessária',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    const userRoles = Array.isArray(req.user.role) ? req.user.role : [req.user.role];
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    const hasRole = requiredRoles.some(role => userRoles.includes(role));
    
    if (!hasRole) {
      logSecurity('INSUFFICIENT_PERMISSIONS', 'medium', {
        userId: req.user.id,
        userRoles,
        requiredRoles,
        ip: req.ip,
        path: req.path
      });
      
      return res.status(403).json({
        error: 'Permissões insuficientes',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: requiredRoles
      });
    }
    
    next();
  };
};

/**
 * Middleware para verificar se o usuário é administrador
 */
const requireAdmin = requireRole(['admin', 'super_admin']);

/**
 * Middleware para verificar se o usuário é moderador ou superior
 */
const requireModerator = requireRole(['moderator', 'admin', 'super_admin']);

/**
 * Middleware para verificar se a conta está verificada
 */
const requireVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      error: 'Autenticação necessária',
      code: 'AUTHENTICATION_REQUIRED'
    });
  }
  
  if (!req.user.isVerified) {
    return res.status(403).json({
      error: 'Conta não verificada',
      code: 'ACCOUNT_NOT_VERIFIED',
      message: 'Verifique seu email para continuar'
    });
  }
  
  next();
};

/**
 * Middleware para verificar se o usuário pode acessar um recurso específico
 * (próprio usuário ou admin)
 */
const requireOwnershipOrAdmin = (userIdParam = 'userId') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Autenticação necessária',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    const targetUserId = req.params[userIdParam] || req.body[userIdParam];
    const isOwner = req.user.id === targetUserId;
    const isAdmin = ['admin', 'super_admin'].includes(req.user.role);
    
    if (!isOwner && !isAdmin) {
      logSecurity('UNAUTHORIZED_ACCESS_ATTEMPT', 'high', {
        userId: req.user.id,
        targetUserId,
        ip: req.ip,
        path: req.path
      });
      
      return res.status(403).json({
        error: 'Acesso negado',
        code: 'ACCESS_DENIED'
      });
    }
    
    next();
  };
};

/**
 * Rate limiting específico para usuários autenticados
 */
const authenticatedRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: (req) => {
    // Usuários premium têm limite maior
    if (req.user?.role === 'premium') return 200;
    if (req.user?.role === 'admin') return 1000;
    return 100; // Usuários normais
  },
  keyGenerator: (req) => {
    // Rate limit por usuário, não por IP
    return req.user?.id || req.ip;
  },
  message: {
    error: 'Muitas requisições. Tente novamente em alguns minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * Middleware para verificar se o usuário tem saldo suficiente
 */
const requireBalance = (minimumAmount) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Autenticação necessária',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    const amount = typeof minimumAmount === 'function' 
      ? minimumAmount(req) 
      : minimumAmount;
    
    if (req.user.balance < amount) {
      return res.status(402).json({
        error: 'Saldo insuficiente',
        code: 'INSUFFICIENT_BALANCE',
        required: amount,
        current: req.user.balance
      });
    }
    
    next();
  };
};

/**
 * Middleware para verificar nível mínimo do usuário
 */
const requireLevel = (minimumLevel) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Autenticação necessária',
        code: 'AUTHENTICATION_REQUIRED'
      });
    }
    
    if (req.user.level < minimumLevel) {
      return res.status(403).json({
        error: 'Nível insuficiente',
        code: 'INSUFFICIENT_LEVEL',
        required: minimumLevel,
        current: req.user.level
      });
    }
    
    next();
  };
};

module.exports = {
  authenticate,
  optionalAuth,
  requireRole,
  requireAdmin,
  requireModerator,
  requireVerified,
  requireOwnershipOrAdmin,
  authenticatedRateLimit,
  requireBalance,
  requireLevel
};