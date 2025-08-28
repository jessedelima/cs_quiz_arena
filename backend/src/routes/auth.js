const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { sendConfirmationEmail } = require('../utils/email');
const { validateRegistration, validateLogin } = require('../utils/validators');

const router = express.Router();

/**
 * @route POST /api/auth/register
 * @desc Registrar um novo usuário
 * @access Public
 */
router.post('/register', async (req, res) => {
  try {
    const { email, username, password, displayName } = req.body;

    // Validar dados de entrada
    const validationResult = validateRegistration(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Dados de registro inválidos', 
        details: validationResult.error.errors 
      });
    }

    const prisma = req.prisma;

    // Verificar se o email já está em uso
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingEmail) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    // Verificar se o username já está em uso
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    });

    if (existingUsername) {
      return res.status(400).json({ error: 'Nome de usuário já está em uso' });
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Gerar token de confirmação
    const confirmationToken = uuidv4();

    // Criar usuário (não verificado)
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        displayName: displayName || username,
        password: hashedPassword,
        isVerified: false,
        // Armazenar o token como metadado temporário
        // Em produção, seria melhor ter uma tabela separada para tokens
      }
    });

    // Enviar email de confirmação
    const confirmationUrl = `${process.env.CORS_ORIGIN}/email-confirmation?token=${confirmationToken}&email=${email}`;
    await sendConfirmationEmail(email, confirmationUrl);

    // Armazenar o token em uma tabela temporária ou cache
    // Aqui estamos usando uma abordagem simplificada
    // Em produção, use Redis ou uma tabela no banco de dados
    global.pendingConfirmations = global.pendingConfirmations || {};
    global.pendingConfirmations[email] = {
      token: confirmationToken,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 horas
    };

    res.status(201).json({
      message: 'Usuário registrado com sucesso. Por favor, verifique seu email para confirmar o registro.',
      userId: newUser.id
    });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

/**
 * @route POST /api/auth/confirm
 * @desc Confirmar email do usuário
 * @access Public
 */
router.post('/confirm', async (req, res) => {
  try {
    const { token, email } = req.body;

    if (!token || !email) {
      return res.status(400).json({ error: 'Token e email são obrigatórios' });
    }

    // Verificar se o token é válido
    const pendingConfirmation = global.pendingConfirmations?.[email];
    
    if (!pendingConfirmation) {
      return res.status(400).json({ error: 'Token de confirmação inválido ou expirado' });
    }

    if (pendingConfirmation.token !== token) {
      return res.status(400).json({ error: 'Token de confirmação inválido' });
    }

    if (new Date() > new Date(pendingConfirmation.expires)) {
      return res.status(400).json({ error: 'Token de confirmação expirado' });
    }

    const prisma = req.prisma;

    // Atualizar usuário para verificado
    const user = await prisma.user.update({
      where: { email },
      data: { isVerified: true }
    });

    // Remover confirmação pendente
    delete global.pendingConfirmations[email];

    // Gerar JWT
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          role: user.role
        }});
      }
    );
  } catch (error) {
    console.error('Erro ao confirmar email:', error);
    res.status(500).json({ error: 'Erro ao confirmar email' });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Autenticar usuário e retornar token JWT
 * @access Public
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar dados de entrada
    const validationResult = validateLogin(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Dados de login inválidos', 
        details: validationResult.error.errors 
      });
    }

    const prisma = req.prisma;

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }

    // Verificar se o usuário está verificado
    if (!user.isVerified) {
      return res.status(400).json({ 
        error: 'Conta não verificada', 
        needsVerification: true 
      });
    }

    // Verificar se o usuário está banido
    if (user.isBanned) {
      const banMessage = user.banExpiresAt 
        ? `Sua conta está suspensa até ${new Date(user.banExpiresAt).toLocaleDateString()}.` 
        : 'Sua conta está permanentemente suspensa.';
      
      return res.status(403).json({ 
        error: 'Conta suspensa', 
        message: banMessage,
        reason: user.banReason
      });
    }

    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }

    // Atualizar último login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Gerar JWT
    const payload = {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
      (err, token) => {
        if (err) throw err;
        res.json({ token, user: {
          id: user.id,
          email: user.email,
          username: user.username,
          displayName: user.displayName,
          avatar: user.avatar,
          balance: user.balance,
          level: user.level,
          xp: user.xp,
          rank: user.rank,
          role: user.role
        }});
      }
    );
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

/**
 * @route POST /api/auth/steam
 * @desc Autenticar usuário via Steam
 * @access Public
 */
router.post('/steam', async (req, res) => {
  // Implementação do login via Steam será adicionada posteriormente
  res.status(501).json({ error: 'Login via Steam ainda não implementado' });
});

/**
 * @route POST /api/auth/google
 * @desc Autenticar usuário via Google
 * @access Public
 */
router.post('/google', async (req, res) => {
  // Implementação do login via Google será adicionada posteriormente
  res.status(501).json({ error: 'Login via Google ainda não implementado' });
});

module.exports = router;