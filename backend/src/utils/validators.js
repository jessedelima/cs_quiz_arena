const { z } = require('zod');

// Schema de validação para registro
const registrationSchema = z.object({
  email: z.string().email('Email inválido'),
  username: z.string().min(3, 'Nome de usuário deve ter pelo menos 3 caracteres').max(20, 'Nome de usuário deve ter no máximo 20 caracteres'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  displayName: z.string().optional()
});

// Schema de validação para login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória')
});

// Schema de validação para atualização de usuário
const userUpdateSchema = z.object({
  displayName: z.string().min(3, 'Nome de exibição deve ter pelo menos 3 caracteres').max(30, 'Nome de exibição deve ter no máximo 30 caracteres').optional(),
  country: z.string().max(2, 'País deve ser um código de 2 letras').optional(),
  avatar: z.string().url('URL de avatar inválida').optional().nullable()
});

/**
 * Valida dados de registro
 * @param {Object} data - Dados de registro
 * @returns {Object} Resultado da validação
 */
function validateRegistration(data) {
  try {
    const validData = registrationSchema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Valida dados de login
 * @param {Object} data - Dados de login
 * @returns {Object} Resultado da validação
 */
function validateLogin(data) {
  try {
    const validData = loginSchema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    return { success: false, error };
  }
}

/**
 * Valida dados de atualização de usuário
 * @param {Object} data - Dados de atualização
 * @returns {Object} Resultado da validação
 */
function validateUserUpdate(data) {
  try {
    const validData = userUpdateSchema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    return { success: false, error };
  }
}

module.exports = {
  validateRegistration,
  validateLogin,
  validateUserUpdate
};