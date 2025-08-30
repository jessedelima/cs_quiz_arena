/**
 * Serviço de autenticação para gerenciar usuários, login e registro
 * Este é um serviço simulado que usa localStorage para persistência
 */

// Chaves para armazenamento no localStorage
const STORAGE_KEYS = {
  USERS: 'cs_quiz_arena_users',
  CURRENT_USER: 'cs_quiz_arena_current_user',
  PENDING_CONFIRMATIONS: 'cs_quiz_arena_pending_confirmations',
  ADMIN_USER: 'cs_quiz_arena_admin_user',
  GOOGLE_USERS: 'cs_quiz_arena_google_users'
};

// Credenciais do administrador
const ADMIN_CREDENTIALS = {
  email: 'admin@csquizarena.com',
  password: 'admin123',
  username: 'Administrator',
  isAdmin: true
};

// Usuários de teste
const TEST_USERS = [
  {
    id: 'user_001',
    username: 'usuario_teste',
    email: 'usuario@teste.com',
    password: 'teste123',
    isConfirmed: true,
    isAdmin: false,
    createdAt: new Date().toISOString(),
    profile: {
      avatar: null,
      bio: 'Usuário de teste para demonstração'
    }
  },
  {
    id: 'user_002',
    username: 'jogador1',
    email: 'jogador1@csquiz.com',
    password: 'jogador123',
    isConfirmed: true,
    isAdmin: false,
    createdAt: new Date().toISOString(),
    profile: {
      avatar: null,
      bio: 'Jogador experiente em CS'
    }
  }
];

// Inicializar o administrador se não existir
const initializeAdmin = () => {
  const adminJson = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
  if (!adminJson) {
    localStorage.setItem(STORAGE_KEYS.ADMIN_USER, JSON.stringify(ADMIN_CREDENTIALS));
  }
};

// Inicializar usuários de teste se não existirem
const initializeTestUsers = () => {
  const users = getUsers();
  if (users.length === 0) {
    saveUsers(TEST_USERS);
    console.log('Usuários de teste inicializados:', TEST_USERS.map(u => ({ email: u.email, password: u.password })));
  }
};

// Inicializar o administrador
initializeAdmin();

/**
 * Gera um token aleatório para confirmação de email ou redefinição de senha
 * @returns {string} - Token gerado
 */
const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15) + 
         Date.now().toString(36);
};

/**
 * Obtém a lista de usuários do localStorage
 * @returns {Array} - Lista de usuários
 */
const getUsers = () => {
  const usersJson = localStorage.getItem(STORAGE_KEYS.USERS);
  return usersJson ? JSON.parse(usersJson) : [];
};

/**
 * Salva a lista de usuários no localStorage
 * @param {Array} users - Lista de usuários
 */
const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
};

/**
 * Obtém a lista de confirmações pendentes do localStorage
 * @returns {Array} - Lista de confirmações pendentes
 */
const getPendingConfirmations = () => {
  const confirmationsJson = localStorage.getItem(STORAGE_KEYS.PENDING_CONFIRMATIONS);
  return confirmationsJson ? JSON.parse(confirmationsJson) : [];
};

/**
 * Salva a lista de confirmações pendentes no localStorage
 * @param {Array} confirmations - Lista de confirmações pendentes
 */
const savePendingConfirmations = (confirmations) => {
  localStorage.setItem(STORAGE_KEYS.PENDING_CONFIRMATIONS, JSON.stringify(confirmations));
};

/**
 * Obtém o usuário atualmente logado
 * @returns {Object|null} - Dados do usuário logado ou null se não houver usuário logado
 */
export const getLoggedInUser = () => {
  const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Registra um novo usuário
 * @param {Object} userData - Dados do usuário
 * @param {string} userData.username - Nome de usuário
 * @param {string} userData.email - Email do usuário
 * @param {string} userData.password - Senha do usuário
 * @returns {Object} - Resultado do registro e token de confirmação
 */
export const registerUser = (userData) => {
  const { username, email, password } = userData;
  
  // Verificar se o email já está em uso
  const users = getUsers();
  if (users.some(user => user.email === email)) {
    return { success: false, error: 'Este email já está em uso.' };
  }
  
  // Verificar se o nome de usuário já está em uso
  if (users.some(user => user.username === username)) {
    return { success: false, error: 'Este nome de usuário já está em uso.' };
  }
  
  // Gerar token de confirmação
  const confirmationToken = generateToken();
  
  // Adicionar à lista de confirmações pendentes
  const pendingConfirmations = getPendingConfirmations();
  pendingConfirmations.push({
    email,
    username,
    password, // Em um ambiente real, a senha seria hash antes de armazenar
    token: confirmationToken,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
  });
  savePendingConfirmations(pendingConfirmations);
  
  return { 
    success: true, 
    message: 'Registro realizado com sucesso. Verifique seu email para confirmar sua conta.',
    confirmationToken,
    email,
    username
  };
};

/**
 * Confirma o email do usuário usando o token
 * @param {string} token - Token de confirmação
 * @param {string} email - Email do usuário
 * @returns {Object} - Resultado da confirmação
 */
export const confirmEmail = (token, email) => {
  const pendingConfirmations = getPendingConfirmations();
  const confirmationIndex = pendingConfirmations.findIndex(
    c => c.token === token && c.email === email && c.expiresAt > Date.now()
  );
  
  if (confirmationIndex === -1) {
    return { success: false, error: 'Token inválido ou expirado.' };
  }
  
  // Obter dados da confirmação
  const confirmation = pendingConfirmations[confirmationIndex];
  
  // Criar novo usuário
  const users = getUsers();
  const newUser = {
    id: Date.now().toString(),
    username: confirmation.username,
    email: confirmation.email,
    password: confirmation.password, // Em um ambiente real, a senha já estaria em hash
    emailConfirmed: true,
    createdAt: Date.now(),
    coins: 100, // Moedas iniciais
    avatar: `https://api.dicebear.com/6.x/avataaars/svg?seed=${confirmation.username}`, // Avatar gerado
    stats: {
      quizzesTaken: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      bestScore: 0
    }
  };
  
  users.push(newUser);
  saveUsers(users);
  
  // Remover da lista de confirmações pendentes
  pendingConfirmations.splice(confirmationIndex, 1);
  savePendingConfirmations(pendingConfirmations);
  
  return { 
    success: true, 
    message: 'Email confirmado com sucesso. Sua conta está ativa.',
    user: { ...newUser, password: undefined } // Não retornar a senha
  };
};

/**
 * Faz login com email e senha
 * @param {string} email - Email do usuário
 * @param {string} password - Senha do usuário
 * @returns {Object} - Resultado do login
 */
export const loginWithEmail = (email, password) => {
  // Verificar se é o administrador
  const adminJson = localStorage.getItem(STORAGE_KEYS.ADMIN_USER);
  const admin = adminJson ? JSON.parse(adminJson) : null;
  
  if (admin && email === admin.email && password === admin.password) {
    const adminUser = { ...admin, password: undefined };
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(adminUser));
    
    return { 
      success: true, 
      message: 'Login de administrador realizado com sucesso.',
      user: adminUser,
      isAdmin: true
    };
  }
  
  // Login de usuário normal
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return { success: false, error: 'Email ou senha incorretos.' };
  }
  
  if (!user.emailConfirmed && !user.isConfirmed) {
    return { success: false, error: 'Por favor, confirme seu email antes de fazer login.' };
  }
  
  // Salvar usuário atual no localStorage
  const userWithoutPassword = { ...user, password: undefined };
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(userWithoutPassword));
  
  return { 
    success: true, 
    message: 'Login realizado com sucesso.',
    user: userWithoutPassword
  };
};

/**
 * Obtém a lista de usuários do Google
 * @returns {Array} - Lista de usuários do Google
 */
const getGoogleUsers = () => {
  const usersJson = localStorage.getItem(STORAGE_KEYS.GOOGLE_USERS);
  return usersJson ? JSON.parse(usersJson) : [];
};

/**
 * Salva a lista de usuários do Google no localStorage
 * @param {Array} users - Lista de usuários do Google
 */
const saveGoogleUsers = (users) => {
  localStorage.setItem(STORAGE_KEYS.GOOGLE_USERS, JSON.stringify(users));
};

/**
 * Faz login com o Google
 * @param {Object} tokenResponse - Resposta do token do Google
 * @returns {Promise<Object>} - Resultado do login
 */
export const loginWithGoogle = async (tokenResponse) => {
  try {
    // Em um ambiente real, enviaríamos o token para o backend para verificação
    // Aqui vamos simular a verificação e obtenção dos dados do usuário
    
    // Simular a obtenção dos dados do usuário a partir do token
    // Em um ambiente real, isso seria feito pelo backend
    const userData = {
      googleId: `google_${Date.now()}`, // Simulando um ID único
      email: `user_${Date.now()}@gmail.com`, // Simulando um email
      name: `Usuário Google ${Math.floor(Math.random() * 1000)}`, // Nome aleatório
      picture: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`, // Avatar aleatório
      accessToken: tokenResponse.access_token
    };
    
    // Verificar se o usuário já existe
    const googleUsers = getGoogleUsers();
    let user = googleUsers.find(u => u.googleId === userData.googleId);
    
    if (!user) {
      // Criar novo usuário
      user = {
        id: Date.now().toString(),
        googleId: userData.googleId,
        username: userData.name,
        email: userData.email,
        avatar: userData.picture,
        emailConfirmed: true, // Emails do Google já são confirmados
        createdAt: Date.now(),
        coins: 100, // Moedas iniciais
        stats: {
          quizzesTaken: 0,
          correctAnswers: 0,
          totalAnswers: 0,
          bestScore: 0
        }
      };
      
      googleUsers.push(user);
      saveGoogleUsers(googleUsers);
      
      // Adicionar também à lista geral de usuários
      const allUsers = getUsers();
      allUsers.push(user);
      saveUsers(allUsers);
    }
    
    // Salvar usuário atual no localStorage
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    
    return { 
      success: true, 
      message: 'Login com Google realizado com sucesso.',
      user
    };
  } catch (error) {
    console.error('Erro ao fazer login com Google:', error);
    return { 
      success: false, 
      error: 'Falha ao autenticar com o Google. Tente novamente.'
    };
  }
};

/**
 * Obtém o usuário atualmente logado
 * @returns {Object|null} - Usuário logado ou null se não houver
 */
export const getCurrentUser = () => {
  const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return userJson ? JSON.parse(userJson) : null;
};

/**
 * Verifica se o usuário atual é um administrador
 * @returns {boolean} - True se o usuário for administrador, false caso contrário
 */
export const isCurrentUserAdmin = () => {
  const currentUser = getCurrentUser();
  return currentUser && currentUser.isAdmin === true;
};

/**
 * Faz logout do usuário atual
 */
export const logout = () => {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
};

/**
 * Solicita redefinição de senha
 * @param {string} email - Email do usuário
 * @returns {Object} - Resultado da solicitação e token de redefinição
 */
export const requestPasswordReset = (email) => {
  const users = getUsers();
  const user = users.find(u => u.email === email);
  
  if (!user) {
    // Por segurança, não informamos se o email existe ou não
    return { 
      success: true, 
      message: 'Se este email estiver registrado, você receberá instruções para redefinir sua senha.',
      resetToken: null
    };
  }
  
  // Gerar token de redefinição
  const resetToken = generateToken();
  
  // Em um ambiente real, armazenaríamos este token em um banco de dados
  // com uma expiração, mas para este exemplo, vamos apenas retorná-lo
  
  return { 
    success: true, 
    message: 'Instruções de redefinição de senha enviadas para seu email.',
    resetToken,
    email
  };
};

/**
 * Redefine a senha do usuário
 * @param {string} token - Token de redefinição
 * @param {string} email - Email do usuário
 * @param {string} newPassword - Nova senha
 * @returns {Object} - Resultado da redefinição
 */
export const resetPassword = (token, email, newPassword) => {
  // Em um ambiente real, verificaríamos o token em um banco de dados
  // Para este exemplo, vamos apenas simular uma verificação bem-sucedida
  
  const users = getUsers();
  const userIndex = users.findIndex(u => u.email === email);
  
  if (userIndex === -1) {
    return { success: false, error: 'Usuário não encontrado.' };
  }
  
  // Atualizar senha
  users[userIndex].password = newPassword;
  saveUsers(users);
  
  return { 
    success: true, 
    message: 'Senha redefinida com sucesso. Você já pode fazer login com sua nova senha.'
  };
};

// Inicializar usuários de teste após todas as funções estarem definidas
initializeTestUsers();
