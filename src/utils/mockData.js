/**
 * Dados mockados para desenvolvimento e testes
 */

// Salas de jogo mockadas
export const mockGameRooms = [
  {
    id: 1,
    name: 'CS2 Quiz Experts',
    category: 'cs2',
    difficulty: 'hard',
    currentPlayers: 3,
    maxPlayers: 10,
    entryFee: 200,
    prize: 1800,
    status: 'waiting',
    hostId: 'user123',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: 2,
    name: 'Casual CS:GO Quiz',
    category: 'csgo',
    difficulty: 'easy',
    currentPlayers: 5,
    maxPlayers: 8,
    entryFee: 50,
    prize: 350,
    status: 'waiting',
    hostId: 'user456',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 3,
    name: 'CS 1.6 Legends',
    category: 'cs16',
    difficulty: 'medium',
    currentPlayers: 8,
    maxPlayers: 8,
    entryFee: 100,
    prize: 700,
    status: 'full',
    hostId: 'user789',
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: 4,
    name: 'Pro CS2 Challenge',
    category: 'cs2',
    difficulty: 'hard',
    currentPlayers: 2,
    maxPlayers: 12,
    entryFee: 500,
    prize: 5500,
    status: 'waiting',
    hostId: 'user101',
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString()
  },
  {
    id: 5,
    name: 'Source Quiz Night',
    category: 'css',
    difficulty: 'medium',
    currentPlayers: 4,
    maxPlayers: 6,
    entryFee: 150,
    prize: 750,
    status: 'waiting',
    hostId: 'user202',
    createdAt: new Date().toISOString()
  }
];

// Dados mockados para tabelas de classificação
export const mockLeaderboardData = {
  weekly: [
    { rank: 1, username: 'ProGamer123', avatar: '/avatars/user1.jpg', earnings: 12500, games: 42, winRate: 76, trend: 'up' },
    { rank: 2, username: 'CS2Master', avatar: '/avatars/user2.jpg', earnings: 10800, games: 38, winRate: 71, trend: 'up' },
    { rank: 3, username: 'QuizKing', avatar: '/avatars/user3.jpg', earnings: 9200, games: 45, winRate: 64, trend: 'down' },
    { rank: 4, username: 'HeadshotQueen', avatar: '/avatars/user4.jpg', earnings: 8700, games: 36, winRate: 69, trend: 'same' },
    { rank: 5, username: 'TacticalMind', avatar: '/avatars/user5.jpg', earnings: 7500, games: 30, winRate: 73, trend: 'up' },
  ],
  monthly: [
    { rank: 1, username: 'CS2Master', avatar: '/avatars/user2.jpg', earnings: 45800, games: 152, winRate: 73, trend: 'up' },
    { rank: 2, username: 'ProGamer123', avatar: '/avatars/user1.jpg', earnings: 42500, games: 168, winRate: 70, trend: 'down' },
    { rank: 3, username: 'TacticalMind', avatar: '/avatars/user5.jpg', earnings: 37500, games: 145, winRate: 68, trend: 'up' },
    { rank: 4, username: 'QuizKing', avatar: '/avatars/user3.jpg', earnings: 32200, games: 180, winRate: 62, trend: 'same' },
    { rank: 5, username: 'HeadshotQueen', avatar: '/avatars/user4.jpg', earnings: 28700, games: 144, winRate: 65, trend: 'down' },
  ],
  allTime: [
    { rank: 1, username: 'CS2Master', avatar: '/avatars/user2.jpg', earnings: 245800, games: 952, winRate: 71, trend: 'same' },
    { rank: 2, username: 'ProGamer123', avatar: '/avatars/user1.jpg', earnings: 242500, games: 968, winRate: 69, trend: 'same' },
    { rank: 3, username: 'QuizKing', avatar: '/avatars/user3.jpg', earnings: 232200, games: 1080, winRate: 64, trend: 'up' },
    { rank: 4, username: 'TacticalMind', avatar: '/avatars/user5.jpg', earnings: 197500, games: 845, winRate: 67, trend: 'down' },
    { rank: 5, username: 'HeadshotQueen', avatar: '/avatars/user4.jpg', earnings: 188700, games: 844, winRate: 66, trend: 'down' },
  ]
};

// Dados mockados para perfil de usuário
export const mockUserProfile = {
  id: 'user123',
  username: 'ProGamer123',
  avatar: '/avatars/user1.jpg',
  balance: 15750,
  steamConnected: true,
  steamProfile: {
    steamId: '76561198012345678',
    nickname: 'CS2_ProGamer',
    avatar: '/avatars/steam_avatar.jpg',
    profileUrl: 'https://steamcommunity.com/id/cs2_progamer'
  },
  stats: {
    totalEarnings: 42500,
    gamesPlayed: 168,
    gamesWon: 118,
    winRate: 70,
    averagePosition: 2.3,
    bestCategory: 'cs2'
  },
  settings: {
    privacy: {
      profileVisibility: 'public',
      showInLeaderboards: true,
      showEarnings: true,
      showPlayHistory: true
    },
    notifications: {
      email: true,
      browser: true,
      newRooms: true,
      friendActivity: true,
      promotions: false
    }
  },
  tradeUrl: 'https://steamcommunity.com/tradeoffer/new/?partner=12345678&token=abcdef'
};

// Dados mockados para participantes de um quiz ao vivo
export const mockLiveParticipants = [
  { id: 'user123', username: 'ProGamer123', avatar: '/avatars/user1.jpg', score: 1200, position: 1, streak: 3 },
  { id: 'user456', username: 'CS2Master', avatar: '/avatars/user2.jpg', score: 1050, position: 2, streak: 2 },
  { id: 'user789', username: 'QuizKing', avatar: '/avatars/user3.jpg', score: 900, position: 3, streak: 0 },
  { id: 'user101', username: 'HeadshotQueen', avatar: '/avatars/user4.jpg', score: 750, position: 4, streak: 1 },
  { id: 'user202', username: 'TacticalMind', avatar: '/avatars/user5.jpg', score: 600, position: 5, streak: 0 },
  { id: 'user303', username: 'FragMachine', avatar: '/avatars/user6.jpg', score: 450, position: 6, streak: 0 },
  { id: 'user404', username: 'AimGod', avatar: '/avatars/user7.jpg', score: 300, position: 7, streak: 0 },
  { id: 'user505', username: 'Clutchmaster', avatar: '/avatars/user8.jpg', score: 150, position: 8, streak: 0 }
];

// Dados mockados para mensagens de chat
export const mockChatMessages = [
  { id: 1, userId: 'user123', username: 'ProGamer123', avatar: '/avatars/user1.jpg', message: 'Olá pessoal! Prontos para o quiz?', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
  { id: 2, userId: 'user456', username: 'CS2Master', avatar: '/avatars/user2.jpg', message: 'Sim, vamos nessa!', timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString() },
  { id: 3, userId: 'user789', username: 'QuizKing', avatar: '/avatars/user3.jpg', message: 'Espero que tenha perguntas sobre o Major!', timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString() },
  { id: 4, userId: 'user101', username: 'HeadshotQueen', avatar: '/avatars/user4.jpg', message: 'Alguém sabe quando começa?', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString() },
  { id: 5, userId: 'user123', username: 'ProGamer123', avatar: '/avatars/user1.jpg', message: 'Acho que em 2 minutos', timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString() },
  { id: 6, userId: 'user202', username: 'TacticalMind', avatar: '/avatars/user5.jpg', message: 'Boa sorte a todos!', timestamp: new Date().toISOString() }
];