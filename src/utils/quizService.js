/**
 * Quiz Service
 * 
 * Serviço para gerenciar perguntas, respostas e pontuações do quiz
 */

// Banco de perguntas mockado
const mockQuestions = [
  {
    id: 1,
    text: 'Qual é o nome do mapa mais jogado de Counter-Strike?',
    options: ['Dust II', 'Mirage', 'Inferno', 'Nuke'],
    correctAnswer: 0,
    image: 'https://placehold.co/800x400/333/FFF?text=Dust+II',
    difficulty: 'easy',
    category: 'maps'
  },
  {
    id: 2,
    text: 'Qual arma tem o maior dano por tiro no CS:GO?',
    options: ['AWP', 'Desert Eagle', 'AK-47', 'M4A4'],
    correctAnswer: 0,
    image: 'https://placehold.co/800x400/333/FFF?text=AWP',
    difficulty: 'medium',
    category: 'weapons'
  },
  {
    id: 3,
    text: 'Quantos jogadores compõem uma equipe padrão de CS?',
    options: ['4', '5', '6', '7'],
    correctAnswer: 1,
    image: null,
    difficulty: 'easy',
    category: 'general'
  },
  {
    id: 4,
    text: 'Qual é o nome do sistema anti-cheat da Valve?',
    options: ['VAC', 'Battleye', 'EAC', 'Punkbuster'],
    correctAnswer: 0,
    image: null,
    difficulty: 'easy',
    category: 'general'
  },
  {
    id: 5,
    text: 'Qual é o preço do kit de defesa no CS:GO?',
    options: ['200$', '400$', '600$', '800$'],
    correctAnswer: 1,
    image: null,
    difficulty: 'medium',
    category: 'economy'
  },
  {
    id: 6,
    text: 'Qual destes mapas NÃO é um mapa oficial de CS:GO?',
    options: ['Cache', 'Vertigo', 'Aztec', 'Overpass'],
    correctAnswer: 2,
    image: 'https://placehold.co/800x400/333/FFF?text=Mapas+CS',
    difficulty: 'medium',
    category: 'maps'
  },
  {
    id: 7,
    text: 'Qual é o tempo padrão para desarmar a bomba sem kit de defesa?',
    options: ['5 segundos', '10 segundos', '15 segundos', '20 segundos'],
    correctAnswer: 1,
    image: null,
    difficulty: 'medium',
    category: 'gameplay'
  },
  {
    id: 8,
    text: 'Qual é o nome do criador original do Counter-Strike?',
    options: ['Gabe Newell', 'Minh Le', 'Jess Cliffe', 'Minh Le e Jess Cliffe'],
    correctAnswer: 3,
    image: null,
    difficulty: 'hard',
    category: 'history'
  },
  {
    id: 9,
    text: 'Qual é a taxa de atualização padrão dos servidores competitivos do CS:GO?',
    options: ['64 tick', '128 tick', '32 tick', '256 tick'],
    correctAnswer: 0,
    image: null,
    difficulty: 'hard',
    category: 'technical'
  },
  {
    id: 10,
    text: 'Qual é o nome do sistema de classificação competitiva do CS:GO?',
    options: ['ELO', 'Glicko', 'Glicko-2', 'TrueSkill'],
    correctAnswer: 2,
    image: null,
    difficulty: 'hard',
    category: 'competitive'
  },
  {
    id: 11,
    text: 'Qual é o nome da operação mais recente do CS:GO?',
    options: ['Hydra', 'Shattered Web', 'Broken Fang', 'Riptide'],
    correctAnswer: 3,
    image: null,
    difficulty: 'medium',
    category: 'updates'
  },
  {
    id: 12,
    text: 'Qual é o preço da AK-47 no CS:GO?',
    options: ['2500$', '2700$', '3000$', '3300$'],
    correctAnswer: 1,
    image: null,
    difficulty: 'medium',
    category: 'economy'
  },
  {
    id: 13,
    text: 'Qual é o nome do mapa que se passa em uma usina nuclear?',
    options: ['Cache', 'Nuke', 'Overpass', 'Vertigo'],
    correctAnswer: 1,
    image: null,
    difficulty: 'easy',
    category: 'maps'
  },
  {
    id: 14,
    text: 'Qual é o nome da granada que cega os jogadores?',
    options: ['Flashbang', 'Smoke', 'HE Grenade', 'Molotov'],
    correctAnswer: 0,
    image: null,
    difficulty: 'easy',
    category: 'weapons'
  },
  {
    id: 15,
    text: 'Qual é o nome do time brasileiro que ganhou o Major de CS:GO em 2016?',
    options: ['MIBR', 'SK Gaming', 'Luminosity Gaming', 'FURIA'],
    correctAnswer: 2,
    image: null,
    difficulty: 'hard',
    category: 'esports'
  }
];

// Armazenamento local simulado para jogos em andamento
let activeGames = [];

/**
 * Busca perguntas para um novo jogo
 * @param {Object} options - Opções de filtro
 * @param {string} options.difficulty - Dificuldade das perguntas (easy, medium, hard)
 * @param {number} options.count - Número de perguntas
 * @param {string} options.category - Categoria das perguntas (opcional)
 * @returns {Array} - Lista de perguntas
 */
const getQuestions = (options = {}) => {
  const { difficulty, count = 10, category } = options;
  
  // Filtrar perguntas por dificuldade e categoria
  let filteredQuestions = [...mockQuestions];
  
  if (difficulty) {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
  }
  
  if (category) {
    filteredQuestions = filteredQuestions.filter(q => q.category === category);
  }
  
  // Embaralhar as perguntas
  filteredQuestions.sort(() => Math.random() - 0.5);
  
  // Retornar o número solicitado de perguntas
  return filteredQuestions.slice(0, count);
};

/**
 * Inicia um novo jogo
 * @param {string} roomId - ID da sala
 * @param {Array} participants - Lista de participantes
 * @param {Object} options - Opções do jogo
 * @returns {Object} - Dados do jogo
 */
const startQuiz = (roomId, participants, options = {}) => {
  // Buscar perguntas para o jogo
  const questions = getQuestions(options);
  
  // Criar novo jogo
  const newGame = {
    roomId,
    status: 'active',
    startTime: new Date(),
    endTime: null,
    questions,
    currentQuestion: 0,
    timePerQuestion: options.timePerQuestion || 15,
    participants: participants.map(p => ({
      userId: p.userId,
      score: 0,
      answers: [],
      position: null
    })),
    results: null
  };
  
  // Adicionar o jogo à lista de jogos ativos
  activeGames.push(newGame);
  
  return newGame;
};

/**
 * Registra a resposta de um jogador
 * @param {string} roomId - ID da sala
 * @param {string} userId - ID do usuário
 * @param {number} questionIndex - Índice da pergunta
 * @param {number} answerIndex - Índice da resposta
 * @param {number} timeSpent - Tempo gasto para responder (segundos)
 * @returns {Object} - Dados atualizados do jogo
 */
const submitAnswer = (roomId, userId, questionIndex, answerIndex, timeSpent) => {
  // Buscar o jogo
  const game = activeGames.find(g => g.roomId === roomId);
  
  if (!game || game.status !== 'active') {
    throw new Error('Jogo não encontrado ou não está ativo');
  }
  
  // Buscar o jogador
  const player = game.participants.find(p => p.userId === userId);
  
  if (!player) {
    throw new Error('Jogador não encontrado');
  }
  
  // Buscar a pergunta
  const question = game.questions[questionIndex];
  
  if (!question) {
    throw new Error('Pergunta não encontrada');
  }
  
  // Verificar se a resposta está correta
  const isCorrect = answerIndex === question.correctAnswer;
  
  // Calcular a pontuação (mais pontos para respostas rápidas e corretas)
  const maxTime = game.timePerQuestion;
  const timeBonus = Math.max(0, maxTime - timeSpent);
  const points = isCorrect ? Math.max(100, 500 - timeSpent * 20) : 0;
  
  // Registrar a resposta
  player.answers[questionIndex] = {
    questionId: question.id,
    answerIndex,
    isCorrect,
    timeSpent,
    points
  };
  
  // Atualizar a pontuação do jogador
  player.score += points;
  
  return game;
};

/**
 * Avança para a próxima pergunta
 * @param {string} roomId - ID da sala
 * @returns {Object} - Dados atualizados do jogo
 */
const nextQuestion = (roomId) => {
  // Buscar o jogo
  const game = activeGames.find(g => g.roomId === roomId);
  
  if (!game || game.status !== 'active') {
    throw new Error('Jogo não encontrado ou não está ativo');
  }
  
  // Verificar se há mais perguntas
  if (game.currentQuestion < game.questions.length - 1) {
    game.currentQuestion += 1;
  } else {
    // Se não houver mais perguntas, finalizar o jogo
    finishQuiz(roomId);
  }
  
  return game;
};

/**
 * Finaliza o quiz e calcula os resultados
 * @param {string} roomId - ID da sala
 * @returns {Object} - Resultados do jogo
 */
const finishQuiz = (roomId) => {
  // Buscar o jogo
  const game = activeGames.find(g => g.roomId === roomId);
  
  if (!game) {
    throw new Error('Jogo não encontrado');
  }
  
  // Atualizar o status do jogo
  game.status = 'completed';
  game.endTime = new Date();
  
  // Ordenar os jogadores por pontuação
  game.participants.sort((a, b) => b.score - a.score);
  
  // Atribuir posições
  game.participants.forEach((player, index) => {
    player.position = index + 1;
  });
  
  // Calcular estatísticas
  const results = {
    roomId: game.roomId,
    startTime: game.startTime,
    endTime: game.endTime,
    duration: (game.endTime - game.startTime) / 1000, // em segundos
    winner: game.participants[0]?.userId,
    playerResults: game.participants.map(p => ({
      userId: p.userId,
      position: p.position,
      score: p.score,
      correctAnswers: p.answers.filter(a => a?.isCorrect).length,
      averageTime: p.answers.reduce((sum, a) => sum + (a?.timeSpent || 0), 0) / p.answers.length
    }))
  };
  
  // Armazenar os resultados
  game.results = results;
  
  return results;
};

/**
 * Busca um jogo ativo por ID da sala
 * @param {string} roomId - ID da sala
 * @returns {Object|null} - Dados do jogo ou null se não encontrado
 */
const getQuizByRoomId = (roomId) => {
  return activeGames.find(g => g.roomId === roomId) || null;
};

/**
 * Busca os resultados de um jogo
 * @param {string} roomId - ID da sala
 * @returns {Object|null} - Resultados do jogo ou null se não encontrado
 */
const getQuizResults = (roomId) => {
  const game = activeGames.find(g => g.roomId === roomId);
  
  if (!game || game.status !== 'completed') {
    return null;
  }
  
  return game.results;
};

export {
  getQuestions,
  startQuiz,
  submitAnswer,
  nextQuestion,
  finishQuiz,
  getQuizByRoomId,
  getQuizResults
};