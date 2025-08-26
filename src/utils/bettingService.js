/**
 * Betting Service
 * 
 * Serviço para gerenciar apostas, transações financeiras e distribuição de prêmios
 * Inclui funcionalidade para apostas "Double or Nothing"
 */

// Simulação de armazenamento local para transações
let transactions = [];
let transactionIdCounter = 1;

/**
 * Processa uma aposta de um jogador
 * @param {string} userId - ID do usuário
 * @param {number} amount - Valor da aposta
 * @param {string} roomId - ID da sala de jogo
 * @returns {Object} - Dados da transação
 */
const placeBet = (userId, amount, roomId) => {
  // Verifica se o usuário tem saldo suficiente
  // Na implementação real, isso seria verificado no banco de dados
  const userBalance = getUserBalance(userId);
  
  if (userBalance < amount) {
    throw new Error('Saldo insuficiente para realizar a aposta');
  }
  
  // Cria a transação
  const transaction = {
    id: `tx-${transactionIdCounter++}`,
    userId,
    type: 'bet',
    amount: -amount, // Valor negativo pois é uma saída
    roomId,
    timestamp: new Date(),
    status: 'completed',
    description: `Aposta na sala ${roomId}`
  };
  
  // Registra a transação
  transactions.push(transaction);
  
  return transaction;
};

/**
 * Distribui prêmios aos vencedores
 * @param {string} roomId - ID da sala de jogo
 * @param {Array} winners - Lista de vencedores com seus prêmios
 * @returns {Array} - Lista de transações
 */
const distributeWinnings = (roomId, winners) => {
  const winningTransactions = [];
  
  winners.forEach(winner => {
    if (winner.winnings <= 0) return;
    
    // Cria a transação
    const transaction = {
      id: `tx-${transactionIdCounter++}`,
      userId: winner.userId,
      type: 'winning',
      amount: winner.winnings, // Valor positivo pois é uma entrada
      roomId,
      timestamp: new Date(),
      status: 'completed',
      description: `Prêmio da sala ${roomId} - Posição: ${winner.position}`
    };
    
    // Registra a transação
    transactions.push(transaction);
    winningTransactions.push(transaction);
  });
  
  return winningTransactions;
};

/**
 * Processa uma aposta dobrada
 * @param {string} userId - ID do usuário
 * @param {number} amount - Valor da aposta
 * @param {string} oldRoomId - ID da sala anterior
 * @param {string} newRoomId - ID da nova sala
 * @returns {Object} - Dados da transação
 */
const placeDoubleDownBet = (userId, amount, oldRoomId, newRoomId) => {
  // Cria a transação
  const transaction = {
    id: `tx-${transactionIdCounter++}`,
    userId,
    type: 'double_down',
    amount: -amount, // Valor negativo pois é uma saída
    oldRoomId,
    newRoomId,
    timestamp: new Date(),
    status: 'completed',
    description: `Aposta dobrada: ${oldRoomId} → ${newRoomId}`
  };
  
  // Registra a transação
  transactions.push(transaction);
  
  return transaction;
};

/**
 * Obtém o saldo de um usuário
 * @param {string} userId - ID do usuário
 * @returns {number} - Saldo atual
 */
const getUserBalance = (userId) => {
  // Na implementação real, isso seria obtido do banco de dados
  // Por enquanto, calculamos com base nas transações
  const userTransactions = transactions.filter(tx => tx.userId === userId);
  return userTransactions.reduce((balance, tx) => balance + tx.amount, 1000); // Saldo inicial de 1000
};

/**
 * Obtém o histórico de transações de um usuário
 * @param {string} userId - ID do usuário
 * @returns {Array} - Lista de transações
 */
const getUserTransactions = (userId) => {
  return transactions.filter(tx => tx.userId === userId);
};

/**
 * Obtém estatísticas de apostas de um usuário
 * @param {string} userId - ID do usuário
 * @returns {Object} - Estatísticas de apostas
 */
const getUserBettingStats = (userId) => {
  const userTransactions = transactions.filter(tx => tx.userId === userId);
  
  const bets = userTransactions.filter(tx => tx.type === 'bet');
  const winnings = userTransactions.filter(tx => tx.type === 'winning');
  
  const totalBets = bets.length;
  const totalBetAmount = bets.reduce((total, tx) => total + Math.abs(tx.amount), 0);
  const totalWinnings = winnings.reduce((total, tx) => total + tx.amount, 0);
  const netProfit = totalWinnings - totalBetAmount;
  
  return {
    totalBets,
    totalBetAmount,
    totalWinnings,
    netProfit,
    roi: totalBetAmount > 0 ? (netProfit / totalBetAmount) * 100 : 0
  };
};

/**
 * Adiciona fundos à conta de um usuário (depósito)
 * @param {string} userId - ID do usuário
 * @param {number} amount - Valor a ser adicionado
 * @returns {Object} - Dados da transação
 */
const addFunds = (userId, amount) => {
  // Cria a transação
  const transaction = {
    id: `tx-${transactionIdCounter++}`,
    userId,
    type: 'deposit',
    amount, // Valor positivo pois é uma entrada
    timestamp: new Date(),
    status: 'completed',
    description: `Depósito de fundos`
  };
  
  // Registra a transação
  transactions.push(transaction);
  
  return transaction;
};

/**
 * Remove fundos da conta de um usuário (saque)
 * @param {string} userId - ID do usuário
 * @param {number} amount - Valor a ser removido
 * @returns {Object} - Dados da transação
 */
const withdrawFunds = (userId, amount) => {
  // Verifica se o usuário tem saldo suficiente
  const userBalance = getUserBalance(userId);
  
  if (userBalance < amount) {
    throw new Error('Saldo insuficiente para realizar o saque');
  }
  
  // Cria a transação
  const transaction = {
    id: `tx-${transactionIdCounter++}`,
    userId,
    type: 'withdraw',
    amount: -amount, // Valor negativo pois é uma saída
    timestamp: new Date(),
    status: 'completed',
    description: `Saque de fundos`
  };
  
  // Registra a transação
  transactions.push(transaction);
  
  return transaction;
};

export {
  placeBet,
  distributeWinnings,
  placeDoubleDownBet,
  getUserBalance,
  getUserTransactions,
  getUserBettingStats,
  addFunds,
  withdrawFunds
};