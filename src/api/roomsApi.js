/**
 * API RESTful para gerenciar salas de torneio
 * 
 * Este serviço simula uma API RESTful para gerenciar salas de torneio,
 * utilizando o gameRoomService como backend para armazenamento de dados.
 */

import { 
  createGameRoom, 
  getAvailableRooms, 
  getRoomById, 
  joinRoom, 
  leaveRoom, 
  setPlayerReady, 
  startGame, 
  finishGame 
} from '../utils/gameRoomService';

// Simulação de um serviço de carteira para gerenciar moedas dos usuários
const walletService = {
  // Armazenamento local simulado para carteiras dos usuários
  wallets: {},

  // Inicializa a carteira de um usuário se não existir
  initWallet: (userId) => {
    if (!walletService.wallets[userId]) {
      walletService.wallets[userId] = {
        balance: 1000, // Saldo inicial para teste
        transactions: []
      };
    }
    return walletService.wallets[userId];
  },

  // Obtém o saldo de um usuário
  getBalance: (userId) => {
    const wallet = walletService.initWallet(userId);
    return wallet.balance;
  },

  // Adiciona moedas à carteira de um usuário
  addCoins: (userId, amount, description) => {
    const wallet = walletService.initWallet(userId);
    wallet.balance += amount;
    wallet.transactions.push({
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: 'credit',
      amount,
      description,
      timestamp: new Date()
    });
    return wallet.balance;
  },

  // Remove moedas da carteira de um usuário
  removeCoins: (userId, amount, description) => {
    const wallet = walletService.initWallet(userId);
    if (wallet.balance < amount) {
      throw new Error('Saldo insuficiente');
    }
    wallet.balance -= amount;
    wallet.transactions.push({
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: 'debit',
      amount,
      description,
      timestamp: new Date()
    });
    return wallet.balance;
  },

  // Obtém o histórico de transações de um usuário
  getTransactions: (userId) => {
    const wallet = walletService.initWallet(userId);
    return wallet.transactions;
  }
};

// Simulação de uma conta da casa para receber comissões
const houseAccount = {
  balance: 0,
  transactions: []
};

/**
 * API RESTful para gerenciar salas de torneio
 */
const roomsApi = {
  /**
   * Obtém todas as salas com status "AGUARDANDO"
   * @returns {Promise<Array>} - Lista de salas disponíveis
   */
  getSalas: async () => {
    try {
      // Simula uma chamada de API com um pequeno delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Obtém todas as salas disponíveis
      const salas = getAvailableRooms();
      
      // Retorna as salas com informações adicionais
      return {
        success: true,
        data: salas.map(sala => ({
          ...sala,
          currentPlayers: sala.participants.length
        }))
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao buscar salas'
      };
    }
  },

  /**
   * Cria uma nova sala
   * @param {Object} data - Dados da sala
   * @param {string} data.nome_sala - Nome da sala
   * @param {number} data.max_jogadores - Número máximo de jogadores
   * @param {number} data.aposta_valor - Valor da aposta
   * @param {string} data.token - Token do criador
   * @returns {Promise<Object>} - Dados da sala criada
   */
  criarSala: async (data) => {
    try {
      const { nome_sala, max_jogadores, aposta_valor, token } = data;
      
      // Validações
      if (!nome_sala || !max_jogadores || aposta_valor === undefined || !token) {
        return {
          success: false,
          error: 'Dados incompletos para criar sala'
        };
      }

      // Extrair ID do usuário do token (em um sistema real, isso seria feito com JWT)
      const userId = token;

      // Verificar se o usuário tem moedas suficientes
      const userBalance = walletService.getBalance(userId);
      if (userBalance < aposta_valor) {
        return {
          success: false,
          error: 'Saldo insuficiente para criar sala'
        };
      }

      // Deduzir o valor da aposta da carteira do usuário
      walletService.removeCoins(userId, aposta_valor, `Criação da sala: ${nome_sala}`);

      // Criar a sala
      const roomData = {
        name: nome_sala,
        maxPlayers: max_jogadores,
        entryFee: aposta_valor,
        difficulty: 'Médio', // Valor padrão
        questionCount: 10, // Valor padrão
        timePerQuestion: 15 // Valor padrão
      };

      const newRoom = createGameRoom(roomData, userId);

      // Simula uma chamada de API com um pequeno delay
      await new Promise(resolve => setTimeout(resolve, 300));

      return {
        success: true,
        data: newRoom
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao criar sala'
      };
    }
  },

  /**
   * Permite um jogador entrar em uma sala
   * @param {string} salaId - ID da sala
   * @param {Object} data - Dados do jogador
   * @param {string} data.token - Token do jogador
   * @returns {Promise<Object>} - Dados da sala atualizada
   */
  entrarSala: async (salaId, data) => {
    try {
      const { token } = data;
      
      // Validações
      if (!salaId || !token) {
        return {
          success: false,
          error: 'Dados incompletos para entrar na sala'
        };
      }

      // Extrair ID do usuário do token (em um sistema real, isso seria feito com JWT)
      const userId = token;

      // Obter a sala
      const sala = getRoomById(salaId);
      if (!sala) {
        return {
          success: false,
          error: 'Sala não encontrada'
        };
      }

      // Verificar se a sala está cheia
      if (sala.participants.length >= sala.maxPlayers) {
        return {
          success: false,
          error: 'Sala está cheia'
        };
      }

      // Verificar se a sala está aguardando jogadores
      if (sala.status !== 'waiting') {
        return {
          success: false,
          error: 'Sala não está aceitando novos jogadores'
        };
      }

      // Verificar se o usuário tem moedas suficientes
      const userBalance = walletService.getBalance(userId);
      if (userBalance < sala.entryFee) {
        return {
          success: false,
          error: 'Saldo insuficiente para entrar na sala'
        };
      }

      // Deduzir o valor da aposta da carteira do usuário
      walletService.removeCoins(userId, sala.entryFee, `Entrada na sala: ${sala.name}`);

      // Adicionar o jogador à sala
      const updatedRoom = joinRoom(salaId, userId, sala.entryFee);

      // Simula uma chamada de API com um pequeno delay
      await new Promise(resolve => setTimeout(resolve, 300));

      return {
        success: true,
        data: updatedRoom
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao entrar na sala'
      };
    }
  },

  /**
   * Inicia uma partida em uma sala
   * @param {string} salaId - ID da sala
   * @param {Object} data - Dados do iniciador
   * @param {string} data.token - Token do iniciador
   * @returns {Promise<Object>} - Dados da sala atualizada
   */
  iniciarSala: async (salaId, data) => {
    try {
      const { token } = data;
      
      // Validações
      if (!salaId || !token) {
        return {
          success: false,
          error: 'Dados incompletos para iniciar a sala'
        };
      }

      // Extrair ID do usuário do token (em um sistema real, isso seria feito com JWT)
      const userId = token;

      // Obter a sala
      const sala = getRoomById(salaId);
      if (!sala) {
        return {
          success: false,
          error: 'Sala não encontrada'
        };
      }

      // Verificar se o usuário é o criador da sala
      if (sala.hostId !== userId) {
        return {
          success: false,
          error: 'Apenas o criador da sala pode iniciá-la'
        };
      }

      // Verificar se há o número mínimo de jogadores
      if (sala.participants.length < sala.settings.minPlayersToStart) {
        return {
          success: false,
          error: `É necessário pelo menos ${sala.settings.minPlayersToStart} jogadores para iniciar`
        };
      }

      // Marcar todos os jogadores como prontos (para simplificar)
      sala.participants.forEach(player => {
        setPlayerReady(salaId, player.userId, true);
      });

      // Iniciar o jogo
      const updatedRoom = startGame(salaId);
      if (!updatedRoom) {
        return {
          success: false,
          error: 'Não foi possível iniciar o jogo'
        };
      }

      // Simula uma chamada de API com um pequeno delay
      await new Promise(resolve => setTimeout(resolve, 300));

      return {
        success: true,
        data: updatedRoom
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao iniciar sala'
      };
    }
  },

  /**
   * Finaliza uma partida e distribui os prêmios
   * @param {string} partidaId - ID da partida (mesmo que salaId)
   * @param {Object} data - Dados do resultado
   * @param {string} data.vencedorId - ID do vencedor
   * @returns {Promise<Object>} - Dados da sala finalizada
   */
  finalizarPartida: async (partidaId, data) => {
    try {
      const { vencedorId } = data;
      
      // Validações
      if (!partidaId || !vencedorId) {
        return {
          success: false,
          error: 'Dados incompletos para finalizar partida'
        };
      }

      // Obter a sala
      const sala = getRoomById(partidaId);
      if (!sala) {
        return {
          success: false,
          error: 'Sala não encontrada'
        };
      }

      // Verificar se a sala está em jogo
      if (sala.status !== 'active') {
        return {
          success: false,
          error: 'A sala não está em jogo'
        };
      }

      // Finalizar o jogo
      const finishedRoom = finishGame(partidaId);
      if (!finishedRoom) {
        return {
          success: false,
          error: 'Não foi possível finalizar o jogo'
        };
      }

      // Calcular o pote total
      const potTotal = finishedRoom.prizePool;
      
      // Calcular a comissão da casa (10%)
      const comissao = Math.floor(potTotal * 0.1);
      
      // Calcular o prêmio do vencedor
      const premio = potTotal - comissao;
      
      // Adicionar o prêmio à carteira do vencedor
      walletService.addCoins(vencedorId, premio, `Prêmio da sala: ${finishedRoom.name}`);
      
      // Adicionar a comissão à carteira do sistema
      houseAccount.balance += comissao;
      houseAccount.transactions.push({
        id: `house-tx-${Date.now()}`,
        type: 'credit',
        amount: comissao,
        description: `Comissão da sala: ${finishedRoom.name}`,
        timestamp: new Date()
      });

      // Simula uma chamada de API com um pequeno delay
      await new Promise(resolve => setTimeout(resolve, 300));

      return {
        success: true,
        data: {
          ...finishedRoom,
          premio,
          comissao
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erro ao finalizar partida'
      };
    }
  }
};

export default roomsApi;