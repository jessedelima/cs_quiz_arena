const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * Gera tokens de acesso e refresh para um usuário
 * @param {Object} user - Objeto do usuário
 * @returns {Object} - Objeto contendo accessToken e refreshToken
 */
function generateTokens(user) {
  const payload = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role || 'user',
    isVerified: user.isVerified
  };
  
  // Access Token (15 minutos)
  const accessToken = jwt.sign(
    payload,
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
      issuer: 'cs-quiz-arena',
      audience: 'cs-quiz-arena-users'
    }
  );
  
  // Refresh Token (7 dias)
  const refreshToken = jwt.sign(
    { userId: user.id, tokenId: crypto.randomUUID() },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
      issuer: 'cs-quiz-arena',
      audience: 'cs-quiz-arena-users'
    }
  );
  
  return {
    accessToken,
    refreshToken,
    expiresIn: 15 * 60 // 15 minutos em segundos
  };
}

/**
 * Verifica e decodifica um access token
 * @param {string} token - Token JWT
 * @returns {Object} - Payload decodificado
 */
function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET, {
      issuer: 'cs-quiz-arena',
      audience: 'cs-quiz-arena-users'
    });
  } catch (error) {
    throw new Error('Token inválido ou expirado');
  }
}

/**
 * Verifica e decodifica um refresh token
 * @param {string} token - Refresh token JWT
 * @returns {Object} - Payload decodificado
 */
function verifyRefreshToken(token) {
  try {
    return jwt.verify(
      token, 
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
      {
        issuer: 'cs-quiz-arena',
        audience: 'cs-quiz-arena-users'
      }
    );
  } catch (error) {
    throw new Error('Refresh token inválido ou expirado');
  }
}

/**
 * Gera um token de verificação de email
 * @param {string} userId - ID do usuário
 * @returns {string} - Token de verificação
 */
function generateVerificationToken(userId) {
  return jwt.sign(
    { userId, type: 'email_verification' },
    process.env.JWT_SECRET,
    {
      expiresIn: '24h',
      issuer: 'cs-quiz-arena'
    }
  );
}

/**
 * Gera um token de reset de senha
 * @param {string} userId - ID do usuário
 * @returns {string} - Token de reset
 */
function generatePasswordResetToken(userId) {
  return jwt.sign(
    { userId, type: 'password_reset' },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
      issuer: 'cs-quiz-arena'
    }
  );
}

/**
 * Extrai o token do header Authorization
 * @param {string} authHeader - Header de autorização
 * @returns {string|null} - Token extraído ou null
 */
function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

/**
 * Verifica se um token está próximo do vencimento
 * @param {string} token - Token JWT
 * @param {number} thresholdMinutes - Limite em minutos (padrão: 5)
 * @returns {boolean} - True se está próximo do vencimento
 */
function isTokenNearExpiry(token, thresholdMinutes = 5) {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    
    const now = Math.floor(Date.now() / 1000);
    const threshold = thresholdMinutes * 60;
    
    return (decoded.exp - now) <= threshold;
  } catch (error) {
    return true;
  }
}

module.exports = {
  generateTokens,
  verifyAccessToken,
  verifyRefreshToken,
  generateVerificationToken,
  generatePasswordResetToken,
  extractTokenFromHeader,
  isTokenNearExpiry
};