/**
 * Serviço de API para comunicação com o backend
 */

// URL base da API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

/**
 * Função auxiliar para fazer requisições HTTP
 * @param {string} endpoint - Endpoint da API
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {Object} data - Dados a serem enviados (para POST e PUT)
 * @param {boolean} requiresAuth - Se a requisição requer autenticação
 * @returns {Promise<Object>} - Resposta da API
 */
async function fetchApi(endpoint, method = 'GET', data = null, requiresAuth = false) {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Adicionar token de autenticação se necessário
  if (requiresAuth) {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Autenticação necessária');
    }
    headers['x-auth-token'] = token;
  }
  
  const options = {
    method,
    headers,
    credentials: 'include',
  };
  
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'Erro na requisição');
    }
    
    return result;
  } catch (error) {
    console.error(`Erro na requisição para ${url}:`, error);
    throw error;
  }
}

/**
 * Serviço de autenticação
 */
export const authApi = {
  /**
   * Registra um novo usuário
   * @param {Object} userData - Dados do usuário
   * @returns {Promise<Object>} - Resposta da API
   */
  register: async (userData) => {
    return fetchApi('/auth/register', 'POST', userData);
  },
  
  /**
   * Confirma o email do usuário
   * @param {string} token - Token de confirmação
   * @param {string} email - Email do usuário
   * @returns {Promise<Object>} - Resposta da API
   */
  confirmEmail: async (token, email) => {
    return fetchApi('/auth/confirm', 'POST', { token, email });
  },
  
  /**
   * Faz login com email e senha
   * @param {string} email - Email do usuário
   * @param {string} password - Senha do usuário
   * @returns {Promise<Object>} - Resposta da API com token e dados do usuário
   */
  login: async (email, password) => {
    const result = await fetchApi('/auth/login', 'POST', { email, password });
    
    // Armazenar token no localStorage
    if (result.token) {
      localStorage.setItem('token', result.token);
    }
    
    return result;
  },
  
  /**
   * Faz logout do usuário atual
   */
  logout: () => {
    localStorage.removeItem('token');
  },
  
  /**
   * Verifica se o usuário está autenticado
   * @returns {boolean} - True se o usuário estiver autenticado, false caso contrário
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  /**
   * Obtém o usuário atual
   * @returns {Promise<Object>} - Dados do usuário
   */
  getCurrentUser: async () => {
    return fetchApi('/users/me', 'GET', null, true);
  },
};

/**
 * Serviço de usuários
 */
export const userApi = {
  /**
   * Atualiza o perfil do usuário
   * @param {Object} userData - Dados do usuário
   * @returns {Promise<Object>} - Resposta da API
   */
  updateProfile: async (userData) => {
    return fetchApi('/users/me', 'PUT', userData, true);
  },
  
  /**
   * Atualiza a senha do usuário
   * @param {string} currentPassword - Senha atual
   * @param {string} newPassword - Nova senha
   * @returns {Promise<Object>} - Resposta da API
   */
  updatePassword: async (currentPassword, newPassword) => {
    return fetchApi('/users/me/password', 'PUT', { currentPassword, newPassword }, true);
  },
  
  /**
   * Obtém o ranking de usuários
   * @returns {Promise<Array>} - Lista de usuários ordenada por XP
   */
  getLeaderboard: async () => {
    return fetchApi('/users/leaderboard', 'GET');
  },
  
  /**
   * Obtém o perfil público de um usuário
   * @param {string} userId - ID do usuário
   * @returns {Promise<Object>} - Dados do usuário
   */
  getUserProfile: async (userId) => {
    return fetchApi(`/users/${userId}`, 'GET');
  },
};

/**
 * Exporta todos os serviços de API
 */
export default {
  auth: authApi,
  user: userApi,
};