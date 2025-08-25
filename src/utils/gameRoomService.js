/**
 * Game Room Service
 * 
 * Serviço para gerenciar salas de jogos com apostas, participantes e distribuição de prêmios
 * Inclui funcionalidade para criar salas "Double or Nothing"
 */

// Armazenamento local simulado para salas de jogo
let gameRooms = [];
let roomIdCounter = 1;

/**
 * Cria uma nova sala de jogo
 * @param {Object} roomData - Dados da sala
 * @param {string} hostId - ID do usuário criador da sala
 * @returns {Object} - Dados da sala criada
 */
const createGameRoom = (roomData, hostId) => {
  const newRoom = {
    id: `room-${roomIdCounter++}`,
    name: roomData.name || `Sala de Quiz #${roomIdCounter}`,
    hostId,
    entryFee: roomData.entryFee || 0,
    prizePool: 0, // Será calculado com base nas entradas
    maxPlayers: roomData.maxPlayers || 10,
    currentPlayers: 1, // O host já está na sala
    difficulty: roomData.difficulty || 'Médio',
    questionCount: roomData.questionCount || 10,
    timePerQuestion: roomData.timePerQuestion || 15,
    status: 'waiting', // waiting, starting, active, completed
    createdAt: new Date(),
    startTime: null,
    endTime: null,
    participants: [
      {
        userId: hostId,
        isHost: true,
        isReady: false,
        joinedAt: new Date(),
        betAmount: roomData.entryFee || 0,
        score: 0,
        position: null,
        answers: [],
        hasDoubledDown: false
      }
    ],
    settings: {
      allowDoubleDown: roomData.allowDoubleDown || true, // Permitir dobrar a aposta
      distributionType: roomData.distributionType || 'winner-takes-all', // winner-takes-all, top3, proportional
      autoStart: roomData.autoStart || true,
      autoStartTime: roomData.autoStartTime || 120, // segundos
      minPlayersToStart: roomData.minPlayersToStart || 2
    },
    chat: [],
    questions: [], // Será preenchido quando o jogo começar
    results: null // Será preenchido quando o jogo terminar
  };

  gameRooms.push(newRoom);
  return newRoom;
};

/**
 * Obtém todas as salas de jogo disponíveis
 * @returns {Array} - Lista de salas disponíveis
 */
const getAvailableRooms = () => {
  return gameRooms.filter(room => 
    room.status === 'waiting' && 
    room.participants.length < room.maxPlayers
  );
};

/**
 * Obtém uma sala de jogo pelo ID
 * @param {string} roomId - ID da sala
 * @returns {Object|null} - Dados da sala ou null se não encontrada
 */
const getRoomById = (roomId) => {
  return gameRooms.find(room => room.id === roomId) || null;
};

/**
 * Adiciona um jogador a uma sala
 * @param {string} roomId - ID da sala
 * @param {string} userId - ID do usuário
 * @param {number} betAmount - Valor da aposta
 * @returns {Object|null} - Dados da sala atualizada ou null se falhar
 */
const joinRoom = (roomId, userId, betAmount) => {
  const room = getRoomById(roomId);
  
  if (!room || room.status !== 'waiting' || room.participants.length >= room.maxPlayers) {
    return null;
  }
  
  // Verifica se o usuário já está na sala
  if (room.participants.some(p => p.userId === userId)) {
    return room;
  }
  
  // Adiciona o jogador
  room.participants.push({
    userId,
    isHost: false,
    isReady: false,
    joinedAt: new Date(),
    betAmount: betAmount || room.entryFee,
    score: 0,
    position: null,
    answers: [],
    hasDoubledDown: false
  });
  
  // Atualiza o número de jogadores e o prêmio total
  room.currentPlayers = room.participants.length;
  room.prizePool = room.participants.reduce((total, p) => total + p.betAmount, 0);
  
  return room;
};

/**
 * Remove um jogador de uma sala
 * @param {string} roomId - ID da sala
 * @param {string} userId - ID do usuário
 * @returns {Object|null} - Dados da sala atualizada ou null se falhar
 */
const leaveRoom = (roomId, userId) => {
  const room = getRoomById(roomId);
  
  if (!room || room.status !== 'waiting') {
    return null;
  }
  
  const playerIndex = room.participants.findIndex(p => p.userId === userId);
  
  if (playerIndex === -1) {
    return room;
  }
  
  const player = room.participants[playerIndex];
  
  // Remove o jogador
  room.participants.splice(playerIndex, 1);
  
  // Atualiza o número de jogadores e o prêmio total
  room.currentPlayers = room.participants.length;
  room.prizePool = room.participants.reduce((total, p) => total + p.betAmount, 0);
  
  // Se o host saiu, transfere o host para o próximo jogador
  if (player.isHost && room.participants.length > 0) {
    room.participants[0].isHost = true;
    room.hostId = room.participants[0].userId;
  }
  
  // Se não há mais jogadores, remove a sala
  if (room.participants.length === 0) {
    gameRooms = gameRooms.filter(r => r.id !== roomId);
    return null;
  }
  
  return room;
};

/**
 * Marca um jogador como pronto
 * @param {string} roomId - ID da sala
 * @param {string} userId - ID do usuário
 * @param {boolean} isReady - Status de pronto
 * @returns {Object|null} - Dados da sala atualizada ou null se falhar
 */
const setPlayerReady = (roomId, userId, isReady) => {
  const room = getRoomById(roomId);
  
  if (!room || room.status !== 'waiting') {
    return null;
  }
  
  const player = room.participants.find(p => p.userId === userId);
  
  if (!player) {
    return room;
  }
  
  player.isReady = isReady;
  
  return room;
};

/**
 * Inicia o jogo em uma sala
 * @param {string} roomId - ID da sala
 * @returns {Object|null} - Dados da sala atualizada ou null se falhar
 */
const startGame = (roomId) => {
  const room = getRoomById(roomId);
  
  if (!room || room.status !== 'waiting') {
    return null;
  }
  
  // Verifica se há jogadores suficientes
  if (room.participants.length < room.settings.minPlayersToStart) {
    return null;
  }
  
  // Verifica se todos os jogadores estão prontos
  const allReady = room.participants.every(p => p.isReady);
  
  if (!allReady) {
    return null;
  }
  
  // Atualiza o status da sala
  room.status = 'active';
  room.startTime = new Date();
  
  // Aqui seria carregado as perguntas do quiz
  // Por enquanto, usamos um placeholder
  room.questions = [];
  
  return room;
};

/**
 * Registra a resposta de um jogador
 * @param {string} roomId - ID da sala
 * @param {string} userId - ID do usuário
 * @param {number} questionIndex - Índice da pergunta
 * @param {number} answerIndex - Índice da resposta
 * @param {number} timeSpent - Tempo gasto para responder (segundos)
 * @returns {Object|null} - Dados da sala atualizada ou null se falhar
 */
const submitAnswer = (roomId, userId, questionIndex, answerIndex, timeSpent) => {
  const room = getRoomById(roomId);
  
  if (!room || room.status !== 'active') {
    return null;
  }
  
  const player = room.participants.find(p => p.userId === userId);
  
  if (!player) {
    return room;
  }
  
  const question = room.questions[questionIndex];
  
  if (!question) {
    return room;
  }
  
  // Verifica se a resposta está correta
  const isCorrect = answerIndex === question.correctAnswer;
  
  // Calcula a pontuação (mais pontos para respostas rápidas e corretas)
  const maxTime = room.timePerQuestion;
  const timeBonus = Math.max(0, maxTime - timeSpent);
  const points = isCorrect ? Math.max(100, 500 - timeSpent * 20) : 0;
  
  // Registra a resposta
  player.answers[questionIndex] = {
    questionId: question.id,
    answerIndex,
    isCorrect,
    timeSpent,
    points
  };
  
  // Atualiza a pontuação do jogador
  player.score += points;
  
  return room;
};

/**
 * Finaliza o jogo e distribui os prêmios
 * @param {string} roomId - ID da sala
 * @returns {Object|null} - Dados da sala atualizada ou null se falhar
 */
const finishGame = (roomId) => {
  const room = getRoomById(roomId);
  
  if (!room || room.status !== 'active') {
    return null;
  }
  
  // Atualiza o status da sala
  room.status = 'completed';
  room.endTime = new Date();
  
  // Ordena os jogadores por pontuação
  room.participants.sort((a, b) => b.score - a.score);
  
  // Atribui posições
  room.participants.forEach((player, index) => {
    player.position = index + 1;
  });
  
  // Distribui os prêmios de acordo com o tipo de distribuição
  const { distributionType } = room.settings;
  const totalPrize = room.prizePool;
  
  if (distributionType === 'winner-takes-all') {
    // O vencedor leva tudo
    if (room.participants.length > 0) {
      room.participants[0].winnings = totalPrize;
    }
  } else if (distributionType === 'top3') {
    // Distribuição para os 3 primeiros (60%, 30%, 10%)
    if (room.participants.length >= 1) {
      room.participants[0].winnings = Math.floor(totalPrize * 0.6);
    }
    if (room.participants.length >= 2) {
      room.participants[1].winnings = Math.floor(totalPrize * 0.3);
    }
    if (room.participants.length >= 3) {
      room.participants[2].winnings = Math.floor(totalPrize * 0.1);
    }
  } else if (distributionType === 'proportional') {
    // Distribuição proporcional à pontuação
    const totalScore = room.participants.reduce((sum, p) => sum + p.score, 0);
    
    if (totalScore > 0) {
      room.participants.forEach(player => {
        player.winnings = Math.floor((player.score / totalScore) * totalPrize);
      });
    }
  }
  
  // Cria o resultado final
  room.results = {
    winner: room.participants[0]?.userId,
    totalPrize,
    finishedAt: room.endTime,
    playerResults: room.participants.map(p => ({
      userId: p.userId,
      position: p.position,
      score: p.score,
      correctAnswers: p.answers.filter(a => a?.isCorrect).length,
      winnings: p.winnings || 0
    }))
  };
  
  return room;
};

/**
 * Oferece ao vencedor a opção de dobrar a aposta
 * @param {string} roomId - ID da sala
 * @param {string} userId - ID do usuário
 * @param {boolean} accept - Se o usuário aceitou dobrar
 * @returns {Object|null} - Dados da nova sala ou null se falhar
 */
const offerDoubleDown = (roomId, userId, accept) => {
  const room = getRoomById(roomId);
  
  if (!room || room.status !== 'completed') {
    return null;
  }
  
  // Verifica se o usuário é o vencedor
  if (room.results.winner !== userId) {
    return null;
  }
  
  if (!accept) {
    return room;
  }
  
  // Cria uma nova sala com o dobro da aposta
  const winner = room.participants.find(p => p.userId === userId);
  const winnings = winner?.winnings || 0;
  
  const newRoomData = {
    name: `${room.name} (Dobro ou Nada)`,
    entryFee: winnings, // A aposta é o valor ganho
    maxPlayers: room.maxPlayers,
    difficulty: room.difficulty,
    questionCount: room.questionCount,
    timePerQuestion: room.timePerQuestion,
    allowDoubleDown: false, // Não permite dobrar novamente
    distributionType: 'winner-takes-all',
    autoStart: true,
    minPlayersToStart: 2
  };
  
  const newRoom = createGameRoom(newRoomData, userId);
  
  // Marca o jogador como tendo dobrado a aposta
  const player = newRoom.participants.find(p => p.userId === userId);
  if (player) {
    player.hasDoubledDown = true;
  }
  
  return newRoom;
};

/**
 * Cria uma nova sala com valor dobrado (Double Down)
 * @param {string} originalRoomId - ID da sala original
 * @param {string} winnerId - ID do usuário vencedor
 * @param {number} winnings - Valor do prêmio ganho
 * @returns {Object} - Nova sala criada
 */
const createDoubleDownRoom = (originalRoomId, winnerId, winnings) => {
  // Buscar sala original
  const originalRoom = gameRooms.find(room => room.id === originalRoomId);
  
  if (!originalRoom) {
    throw new Error('Sala original não encontrada');
  }
  
  // Criar nova sala com valor dobrado
  const newRoom = {
    id: `double-${roomIdCounter++}`,
    name: `${originalRoom.name} - Double or Nothing`,
    hostId: winnerId,
    entryFee: winnings, // O valor da aposta é o prêmio ganho
    prizePool: winnings,
    maxPlayers: originalRoom.maxPlayers,
    currentPlayers: 1, // Apenas o vencedor inicialmente
    difficulty: originalRoom.difficulty,
    questionCount: originalRoom.questionCount,
    timePerQuestion: originalRoom.timePerQuestion,
    status: 'waiting',
    createdAt: new Date(),
    startTime: null,
    endTime: null,
    participants: [
      {
        userId: winnerId,
        isHost: true,
        isReady: false,
        joinedAt: new Date(),
        betAmount: winnings,
        score: 0,
        position: null,
        answers: [],
        hasDoubledDown: true
      }
    ],
    settings: {
      allowDoubleDown: true,
      distributionType: 'winner-takes-all', // Double or Nothing sempre é winner-takes-all
      autoStart: originalRoom.settings.autoStart,
      autoStartTime: originalRoom.settings.autoStartTime,
      isDoubleDown: true,
      originalRoomId
    }
  };
  
  // Adicionar a nova sala à lista
  gameRooms.push(newRoom);
  
  return newRoom;
};

/**
 * Alias para getRoomById para compatibilidade com código existente
 * @param {string} roomId - ID da sala
 * @returns {Object|null} - Dados da sala ou null se não encontrada
 */
const getGameRoomById = (roomId) => {
  return getRoomById(roomId);
};

/**
 * Busca todas as salas de jogo disponíveis
 * @returns {Promise<Array>} - Promise com a lista de salas
 */
const fetchGameRooms = async () => {
  // Simulação de chamada assíncrona
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getAvailableRooms());
    }, 500);
  });
};

export {
  createGameRoom,
  getAvailableRooms,
  getRoomById,
  getGameRoomById,
  fetchGameRooms,
  joinRoom,
  leaveRoom,
  setPlayerReady,
  startGame,
  submitAnswer,
  finishGame,
  offerDoubleDown,
  createDoubleDownRoom
};