/**
 * Serviço para gerenciar tokens JWT no frontend
 */

// Chave para armazenamento do token JWT
const TOKEN_KEY = 'cs-quiz-auth-token';

/**
 * Armazena o token JWT no localStorage
 * @param {string} token - Token JWT a ser armazenado
 */
export const setToken = (token) => {
  if (!token) {
    console.error('Tentativa de armazenar token vazio');
    return;
  }
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Recupera o token JWT do localStorage
 * @returns {string|null} - Token JWT ou null se não existir
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove o token JWT do localStorage
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

/**
 * Verifica se existe um token JWT armazenado
 * @returns {boolean} - True se existir um token, false caso contrário
 */
export const hasToken = () => {
  return !!getToken();
};

/**
 * Adiciona o token JWT como cabeçalho de autorização em uma requisição
 * @param {object} headers - Cabeçalhos da requisição
 * @returns {object} - Cabeçalhos com o token adicionado
 */
export const addTokenToHeaders = (headers = {}) => {
  const token = getToken();
  if (token) {
    return {
      ...headers,
      'Authorization': `Bearer ${token}`
    };
  }
  return headers;
};

export default {
  setToken,
  getToken,
  removeToken,
  hasToken,
  addTokenToHeaders
};