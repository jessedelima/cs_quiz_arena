import tokenService from './tokenService';

// URL base da API (deve ser configurada no arquivo .env)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

/**
 * Função para fazer requisições à API com autenticação
 * @param {string} endpoint - Endpoint da API
 * @param {string} method - Método HTTP (GET, POST, PUT, DELETE)
 * @param {object} data - Dados a serem enviados no corpo da requisição
 * @returns {Promise} - Promise com a resposta da requisição
 */
async function apiRequest(endpoint, method = 'GET', data = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Adiciona o token de autenticação aos cabeçalhos, se disponível
  tokenService.addTokenToHeaders(headers);
  
  const config = {
    method,
    headers,
  };
  
  if (data && (method === 'POST' || method === 'PUT')) {
    config.body = JSON.stringify(data);
  }
  
  try {
    // Simulação de resposta do backend para desenvolvimento
    if (process.env.NODE_ENV === 'development' || !API_URL.includes('localhost')) {
      return await mockApiResponse(endpoint, method, data);
    }
    
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Erro na requisição');
    }
    
    return responseData;
  } catch (error) {
    console.error('Erro na requisição à API:', error);
    throw error;
  }
}

/**
 * Função para simular respostas da API durante o desenvolvimento
 * @param {string} endpoint - Endpoint da API
 * @param {string} method - Método HTTP
 * @param {object} data - Dados enviados na requisição
 * @returns {Promise} - Promise com a resposta simulada
 */
async function mockApiResponse(endpoint, method, data) {
  // Simula um atraso de rede
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Simulação de verificação de token
  if (endpoint.includes('/verify-token')) {
    return {
      valid: true,
      user: {
        id: 'user-123',
        name: 'Usuário Teste',
        email: 'usuario@teste.com',
        photoUrl: 'https://i.pravatar.cc/150?img=3',
        wallet: {
          balance: 1000
        }
      }
    };
  }
  
  // Simulação de criação de usuário
  if (endpoint.includes('/users') && method === 'POST') {
    const { name, email, photoUrl } = data;
    return {
      success: true,
      user: {
        id: `user-${Date.now()}`,
        name,
        email,
        photoUrl,
        wallet: {
          balance: 500 // Saldo inicial para novos usuários
        },
        createdAt: new Date().toISOString()
      }
    };
  }
  
  // Simulação de obtenção de perfil do usuário
  if (endpoint.includes('/users/profile')) {
    return {
      id: 'user-123',
      name: 'Usuário Teste',
      email: 'usuario@teste.com',
      photoUrl: 'https://i.pravatar.cc/150?img=3',
      wallet: {
        balance: 1000
      },
      stats: {
        gamesPlayed: 42,
        gamesWon: 15,
        totalEarnings: 2500
      }
    };
  }
  
  // Resposta padrão para endpoints não simulados
  return {
    success: true,
    message: 'Operação simulada com sucesso',
    data: data || {}
  };
}

/**
 * Verifica a validade do token com o backend
 * @returns {Promise} - Promise com o resultado da verificação
 */
export async function verifyToken() {
  try {
    const response = await apiRequest('/auth/verify-token', 'GET');
    return response;
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return { valid: false, error: error.message };
  }
}

/**
 * Cria ou atualiza um usuário no backend
 * @param {object} userData - Dados do usuário
 * @returns {Promise} - Promise com o resultado da operação
 */
export async function createOrUpdateUser(userData) {
  try {
    const response = await apiRequest('/users', 'POST', userData);
    return response;
  } catch (error) {
    console.error('Erro ao criar/atualizar usuário:', error);
    throw error;
  }
}

/**
 * Obtém o perfil do usuário atual
 * @returns {Promise} - Promise com os dados do perfil
 */
export async function getUserProfile() {
  try {
    const response = await apiRequest('/users/profile', 'GET');
    return response;
  } catch (error) {
    console.error('Erro ao obter perfil do usuário:', error);
    throw error;
  }
}

export default {
  verifyToken,
  createOrUpdateUser,
  getUserProfile
};