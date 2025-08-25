// Mock data para desenvolvimento

export const mockGameRooms = [
  {
    id: 'room1',
    name: 'Quiz CS2 Profissional',
    creatorId: 'user456',
    entryFee: 100,
    prizePool: 500,
    difficulty: 'Difícil',
    maxPlayers: 10,
    questionCount: 15,
    timePerQuestion: 10,
    distributionType: 'winner-takes-all',
    allowDoubleDown: true,
    participants: [
      { userId: 'user456', username: 'CS_Master', ready: true },
      { userId: 'user789', username: 'HeadShot_King', ready: false },
      { userId: 'user101', username: 'Clutch_God', ready: true },
      { userId: 'user202', username: 'Sniper_Elite', ready: true }
    ],
    status: 'waiting'
  },
  {
    id: 'room2',
    name: 'Quiz para Iniciantes',
    creatorId: 'user789',
    entryFee: 50,
    prizePool: 150,
    difficulty: 'Fácil',
    maxPlayers: 5,
    questionCount: 10,
    timePerQuestion: 20,
    distributionType: 'top-3',
    allowDoubleDown: false,
    participants: [
      { userId: 'user789', username: 'HeadShot_King', ready: true },
      { userId: 'user303', username: 'Newbie_Player', ready: false }
    ],
    status: 'waiting'
  },
  {
    id: 'room3',
    name: 'Quiz Tático',
    creatorId: 'user101',
    entryFee: 200,
    prizePool: 600,
    difficulty: 'Médio',
    maxPlayers: 8,
    questionCount: 12,
    timePerQuestion: 15,
    distributionType: 'proportional',
    allowDoubleDown: true,
    participants: [
      { userId: 'user101', username: 'Clutch_God', ready: true },
      { userId: 'user456', username: 'CS_Master', ready: true },
      { userId: 'user505', username: 'Tactical_Mind', ready: false },
      { userId: 'user606', username: 'Smoke_Expert', ready: true },
      { userId: 'user707', username: 'Flash_King', ready: false }
    ],
    status: 'waiting'
  },
  {
    id: 'room4',
    name: 'Quiz Gratuito',
    creatorId: 'user202',
    entryFee: 0,
    prizePool: 0,
    difficulty: 'Fácil',
    maxPlayers: 15,
    questionCount: 8,
    timePerQuestion: 20,
    distributionType: 'winner-takes-all',
    allowDoubleDown: false,
    participants: [
      { userId: 'user202', username: 'Sniper_Elite', ready: true },
      { userId: 'user303', username: 'Newbie_Player', ready: false },
      { userId: 'user404', username: 'AWP_Master', ready: true },
      { userId: 'user505', username: 'Tactical_Mind', ready: false },
      { userId: 'user606', username: 'Smoke_Expert', ready: true },
      { userId: 'user707', username: 'Flash_King', ready: false },
      { userId: 'user808', username: 'Pistol_Pro', ready: true }
    ],
    status: 'waiting'
  },
  {
    id: 'room5',
    name: 'Quiz de Alto Risco',
    creatorId: 'user404',
    entryFee: 500,
    prizePool: 1500,
    difficulty: 'Difícil',
    maxPlayers: 6,
    questionCount: 20,
    timePerQuestion: 10,
    distributionType: 'winner-takes-all',
    allowDoubleDown: true,
    participants: [
      { userId: 'user404', username: 'AWP_Master', ready: true },
      { userId: 'user456', username: 'CS_Master', ready: true },
      { userId: 'user101', username: 'Clutch_God', ready: false }
    ],
    status: 'waiting'
  }
];