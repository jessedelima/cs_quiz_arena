const express = require('express');
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const { validateUserUpdate } = require('../utils/validators');

const router = express.Router();

/**
 * @route GET /api/users/me
 * @desc Obter dados do usuário atual
 * @access Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    const prisma = req.prisma;
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        balance: true,
        level: true,
        xp: true,
        rank: true,
        country: true,
        role: true,
        createdAt: true,
        lastLogin: true,
        // Não retornar senha e outros campos sensíveis
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    res.status(500).json({ error: 'Erro ao obter dados do usuário' });
  }
});

/**
 * @route PUT /api/users/me
 * @desc Atualizar dados do usuário atual
 * @access Private
 */
router.put('/me', auth, async (req, res) => {
  try {
    const { displayName, country, avatar } = req.body;

    // Validar dados de entrada
    const validationResult = validateUserUpdate(req.body);
    if (!validationResult.success) {
      return res.status(400).json({ 
        error: 'Dados de atualização inválidos', 
        details: validationResult.error.errors 
      });
    }

    const prisma = req.prisma;

    // Atualizar usuário
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        displayName: displayName,
        country: country,
        avatar: avatar,
        updatedAt: new Date()
      },
      select: {
        id: true,
        email: true,
        username: true,
        displayName: true,
        avatar: true,
        balance: true,
        level: true,
        xp: true,
        rank: true,
        country: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
});

/**
 * @route PUT /api/users/me/password
 * @desc Atualizar senha do usuário atual
 * @access Private
 */
router.put('/me/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'A nova senha deve ter pelo menos 8 caracteres' });
    }

    const prisma = req.prisma;

    // Obter usuário com senha
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    // Verificar senha atual
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }

    // Hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Atualizar senha
    await prisma.user.update({
      where: { id: req.user.id },
      data: {
        password: hashedPassword,
        updatedAt: new Date()
      }
    });

    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar senha:', error);
    res.status(500).json({ error: 'Erro ao atualizar senha' });
  }
});

/**
 * @route GET /api/users/leaderboard
 * @desc Obter ranking de usuários
 * @access Public
 */
router.get('/leaderboard', async (req, res) => {
  try {
    const prisma = req.prisma;
    
    // Obter top 100 usuários por XP
    const leaderboard = await prisma.user.findMany({
      where: {
        isActive: true,
        isBanned: false
      },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        level: true,
        xp: true,
        rank: true,
        country: true
      },
      orderBy: [
        { xp: 'desc' },
        { level: 'desc' }
      ],
      take: 100
    });

    res.json(leaderboard);
  } catch (error) {
    console.error('Erro ao obter leaderboard:', error);
    res.status(500).json({ error: 'Erro ao obter leaderboard' });
  }
});

/**
 * @route GET /api/users/:id
 * @desc Obter perfil público de um usuário
 * @access Public
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const prisma = req.prisma;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        username: true,
        displayName: true,
        avatar: true,
        level: true,
        xp: true,
        rank: true,
        country: true,
        createdAt: true,
        // Não retornar campos sensíveis
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    // Obter estatísticas do usuário
    const quizCount = await prisma.quizResult.count({
      where: { userId: id }
    });

    const achievements = await prisma.userAchievement.count({
      where: { userId: id }
    });

    // Obter melhor posição em quiz
    const bestResult = await prisma.quizResult.findFirst({
      where: { userId: id },
      orderBy: { position: 'asc' },
      select: { position: true }
    });

    res.json({
      ...user,
      stats: {
        quizCount,
        achievements,
        bestPosition: bestResult?.position || null
      }
    });
  } catch (error) {
    console.error('Erro ao obter perfil do usuário:', error);
    res.status(500).json({ error: 'Erro ao obter perfil do usuário' });
  }
});

module.exports = router;