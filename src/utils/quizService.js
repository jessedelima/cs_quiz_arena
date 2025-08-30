/**
 * Serviço para gerenciar quizzes, perguntas e respostas
 * Este é um serviço simulado que será substituído por chamadas de API reais
 */

// Armazenamento local para quizzes ativos
const activeQuizzes = new Map();

/**
 * Obtém perguntas para um quiz
 * @param {Object} options - Opções para obter perguntas
 * @param {string} options.difficulty - Dificuldade das perguntas (fácil, médio, difícil)
 * @param {number} options.count - Número de perguntas
 * @param {string} options.category - Categoria das perguntas (opcional)
 * @returns {Array} - Lista de perguntas
 */
export const getQuestions = (options = {}) => {
  const { difficulty = 'medium', count = 10, category = 'all' } = options;
  
  // Simulação de perguntas
  const questions = [
    {
      id: 1,
      text: 'Qual é o nome do mapa mais jogado de Counter-Strike?',
      options: [
        'Dust II',
        'Mirage',
        'Inferno',
        'Nuke'
      ],
      correctAnswer: 0,
      difficulty: 'easy',
      category: 'maps'
    },
    {
      id: 2,
      text: 'Qual arma tem o maior dano por tiro no CS2?',
      options: [
        'AK-47',
        'AWP',
        'Desert Eagle',
        'M4A4'
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'weapons'
    },
    {
      id: 3,
      text: 'Qual é o nome da granada que cega os jogadores?',
      options: [
        'Smoke',
        'Flashbang',
        'HE Grenade',
        'Molotov'
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'weapons'
    },
    {
      id: 4,
      text: 'Qual time ganhou o Major de CS:GO em 2023?',
      options: [
        'Astralis',
        'Natus Vincere (NAVI)',
        'Team Liquid',
        'Vitality'
      ],
      correctAnswer: 3,
      difficulty: 'medium',
      category: 'esports'
    },
    {
      id: 5,
      text: 'Qual é o preço do kit de desarme no CS2?',
      options: [
        '$200',
        '$400',
        '$600',
        '$800'
      ],
      correctAnswer: 1,
      difficulty: 'medium',
      category: 'economy'
    },
    {
      id: 6,
      text: 'Qual jogador é conhecido como "The King of Banana"?',
      options: [
        'GeT_RiGhT',
        'f0rest',
        'friberg',
        's1mple'
      ],
      correctAnswer: 2,
      difficulty: 'hard',
      category: 'players'
    },
    {
      id: 7,
      text: 'Qual é o tempo padrão para desarmar a bomba sem kit?',
      options: [
        '5 segundos',
        '10 segundos',
        '15 segundos',
        '20 segundos'
      ],
      correctAnswer: 1,
      difficulty: 'easy',
      category: 'gameplay'
    },
    {
      id: 8,
      text: 'Qual é o nome do sistema anti-cheat da Valve?',
      options: [
        'VAC',
        'FACEIT',
        'ESEA',
        'BattlEye'
      ],
      correctAnswer: 0,
      difficulty: 'easy',
      category: 'general'
    },
    {
      id: 9,
      text: 'Qual é a taxa de atualização padrão dos servidores competitivos do CS2?',
      options: [
        '64 tick',
        '128 tick',
        '256 tick',
        '32 tick'
      ],
      correctAnswer: 0,
      difficulty: 'medium',
      category: 'technical'
    },
    {
      id: 10,
      text: 'Qual é o nome do sistema de ranqueamento do CS2?',
      options: [
        'Elo',
        'Glicko',
        'Premier',
        'Skill Groups'
      ],
      correctAnswer: 3,
      difficulty: 'medium',
      category: 'gameplay'
    }
  ];
  
  // Filtrar por dificuldade e categoria se necessário
  let filteredQuestions = questions;
  
  if (difficulty !== 'all') {
    filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
  }
  
  if (category !== 'all') {
    filteredQuestions = filteredQuestions.filter(q => q.category === category);
  }
  
  // Embaralhar e limitar ao número solicitado
  return shuffleArray(filteredQuestions).slice(0, count);
};

/**
 * Inicia um novo quiz
 * @param {string} roomId - ID da sala
 * @param {Array} participants - Lista de participantes
 * @param {Object} options - Opções do quiz
 * @returns {Object} - Dados do quiz iniciado
 */
export const startQuiz = (roomId, participants, options = {}) => {
  const questions = getQuestions(options);
  
  const quiz = {
    roomId,
    participants: participants.map(p => ({
      ...p,
      score: 0,
      answers: [],
      position: 0
    })),
    questions,
    currentQuestion: 0,
    status: 'active',
    startTime: new Date(),
    timePerQuestion: options.timePerQuestion || 15,
    results: null
  };
  
  // Armazenar o quiz ativo
  activeQuizzes.set(roomId, quiz);
  
  return quiz;
};

/**
 * Submete uma resposta para uma pergunta
 * @param {string} roomId - ID da sala
 * @param {string} userId - ID do usuário
 * @param {number} questionIndex - Índice da pergunta
 * @param {number} answerIndex - Índice da resposta escolhida
 * @param {number} timeSpent - Tempo gasto para responder (em segundos)
 * @returns {Object} - Resultado da resposta
 */
export const submitAnswer = (roomId, userId, questionIndex, answerIndex, timeSpent) => {
  const quiz = activeQuizzes.get(roomId);
  
  if (!quiz || quiz.status !== 'active' || questionIndex !== quiz.currentQuestion) {
    return { success: false, error: 'Quiz inválido ou pergunta incorreta' };
  }
  
  const question = quiz.questions[questionIndex];
  const isCorrect = answerIndex === question.correctAnswer;
  
  // Calcular pontos baseado na velocidade e precisão
  const maxPoints = 100;
  const timeBonus = Math.max(0, 1 - (timeSpent / quiz.timePerQuestion));
  const points = isCorrect ? Math.round(maxPoints * (0.7 + (0.3 * timeBonus))) : 0;
  
  // Atualizar pontuação do participante
  const participantIndex = quiz.participants.findIndex(p => p.userId === userId);
  
  if (participantIndex >= 0) {
    const participant = quiz.participants[participantIndex];
    
    participant.answers.push({
      questionIndex,
      answerIndex,
      isCorrect,
      timeSpent,
      points
    });
    
    participant.score += points;
    
    // Atualizar posições no ranking
    quiz.participants.sort((a, b) => b.score - a.score);
    quiz.participants.forEach((p, index) => {
      p.position = index + 1;
    });
  }
  
  return {
    success: true,
    isCorrect,
    points,
    correctAnswer: question.correctAnswer,
    newScore: quiz.participants[participantIndex]?.score || 0,
    position: quiz.participants[participantIndex]?.position || 0
  };
};

/**
 * Avança para a próxima pergunta
 * @param {string} roomId - ID da sala
 * @returns {Object} - Estado atualizado do quiz
 */
export const nextQuestion = (roomId) => {
  const quiz = activeQuizzes.get(roomId);
  
  if (!quiz || quiz.status !== 'active') {
    return { success: false, error: 'Quiz inválido' };
  }
  
  // Verificar se há mais perguntas
  if (quiz.currentQuestion < quiz.questions.length - 1) {
    quiz.currentQuestion += 1;
    return {
      success: true,
      currentQuestion: quiz.currentQuestion,
      totalQuestions: quiz.questions.length,
      question: quiz.questions[quiz.currentQuestion]
    };
  } else {
    // Se não houver mais perguntas, finalizar o quiz
    return finishQuiz(roomId);
  }
};

/**
 * Finaliza um quiz
 * @param {string} roomId - ID da sala
 * @returns {Object} - Resultados do quiz
 */
export const finishQuiz = (roomId) => {
  const quiz = activeQuizzes.get(roomId);
  
  if (!quiz) {
    return { success: false, error: 'Quiz não encontrado' };
  }
  
  quiz.status = 'completed';
  quiz.endTime = new Date();
  
  // Calcular estatísticas finais
  const results = {
    participants: quiz.participants.map(p => ({
      userId: p.userId,
      name: p.name,
      avatar: p.avatar,
      score: p.score,
      position: p.position,
      correctAnswers: p.answers.filter(a => a.isCorrect).length,
      totalAnswers: p.answers.length,
      averageTime: p.answers.reduce((sum, a) => sum + a.timeSpent, 0) / p.answers.length || 0,
      fastAnswers: p.answers.filter(a => a.timeSpent < 5).length
    })),
    duration: (quiz.endTime - quiz.startTime) / 1000, // em segundos
    totalQuestions: quiz.questions.length
  };
  
  quiz.results = results;
  
  return {
    success: true,
    results
  };
};

/**
 * Obtém os resultados de um quiz
 * @param {string} roomId - ID da sala
 * @returns {Object} - Resultados do quiz
 */
export const getQuizResults = (roomId) => {
  const quiz = activeQuizzes.get(roomId);
  
  if (!quiz || quiz.status !== 'completed' || !quiz.results) {
    return { success: false, error: 'Resultados não disponíveis' };
  }
  
  return {
    success: true,
    results: quiz.results
  };
};

// Função auxiliar para embaralhar um array
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}