const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar usuário administrador
  const adminExists = await prisma.user.findUnique({
    where: { email: 'admin@csquizarena.com' }
  });

  if (!adminExists) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await prisma.user.create({
      data: {
        email: 'admin@csquizarena.com',
        username: 'admin',
        displayName: 'Administrador',
        password: hashedPassword,
        isVerified: true,
        role: 'admin',
        balance: 1000,
        level: 50,
        xp: 10000,
        rank: 'Global Elite'
      }
    });

    console.log('Usuário administrador criado com sucesso!');
  } else {
    console.log('Usuário administrador já existe, pulando...');
  }

  // Criar algumas conquistas
  const achievements = [
    {
      name: 'Primeira Vitória',
      description: 'Vença seu primeiro quiz',
      category: 'quiz',
      points: 10
    },
    {
      name: 'Especialista em CS',
      description: 'Acerte 100 perguntas sobre Counter-Strike',
      category: 'knowledge',
      points: 50
    },
    {
      name: 'Maratonista',
      description: 'Participe de 10 quizzes em um único dia',
      category: 'participation',
      points: 30
    },
    {
      name: 'Colecionador de Troféus',
      description: 'Ganhe 5 torneios',
      category: 'tournament',
      points: 100
    },
    {
      name: 'Velocista',
      description: 'Responda 10 perguntas em menos de 3 segundos cada',
      category: 'speed',
      points: 25
    }
  ];

  for (const achievement of achievements) {
    const exists = await prisma.achievement.findUnique({
      where: { name: achievement.name }
    });

    if (!exists) {
      await prisma.achievement.create({
        data: achievement
      });
      console.log(`Conquista "${achievement.name}" criada com sucesso!`);
    } else {
      console.log(`Conquista "${achievement.name}" já existe, pulando...`);
    }
  }

  // Criar algumas perguntas de exemplo
  const questions = [
    {
      text: 'Qual é o nome do mapa mais jogado de Counter-Strike?',
      option1: 'Dust II',
      option2: 'Mirage',
      option3: 'Inferno',
      option4: 'Nuke',
      correctAnswer: 1,
      category: 'mapas',
      difficulty: 'fácil',
      tagsJson: JSON.stringify(['mapas', 'clássico'])
    },
    {
      text: 'Qual é a arma mais cara do jogo?',
      option1: 'AWP',
      option2: 'Negev',
      option3: 'AK-47',
      option4: 'M4A4',
      correctAnswer: 2,
      category: 'armas',
      difficulty: 'médio',
      tagsJson: JSON.stringify(['armas', 'economia'])
    },
    {
      text: 'Qual time venceu o Major de Berlim 2019?',
      option1: 'Astralis',
      option2: 'Team Liquid',
      option3: 'Natus Vincere',
      option4: 'Fnatic',
      correctAnswer: 1,
      category: 'esports',
      difficulty: 'difícil',
      tagsJson: JSON.stringify(['esports', 'torneios', 'major'])
    },
    {
      text: 'Qual é o nome da granada que cega os jogadores?',
      option1: 'HE Grenade',
      option2: 'Smoke Grenade',
      option3: 'Flashbang',
      option4: 'Molotov',
      correctAnswer: 3,
      category: 'armas',
      difficulty: 'fácil',
      tagsJson: JSON.stringify(['armas', 'granadas'])
    },
    {
      text: 'Quantos jogadores compõem uma equipe em uma partida competitiva?',
      option1: '4',
      option2: '5',
      option3: '6',
      option4: '10',
      correctAnswer: 2,
      category: 'regras',
      difficulty: 'fácil',
      tagsJson: JSON.stringify(['regras', 'básico'])
    },
    {
      text: 'Qual é o nome do sistema anti-cheating da Valve?',
      option1: 'VAC',
      option2: 'FairPlay',
      option3: 'AntiCheat',
      option4: 'VACnet',
      correctAnswer: 1,
      category: 'geral',
      difficulty: 'médio',
      tagsJson: JSON.stringify(['sistema', 'valve'])
    },
    {
      text: 'Qual jogador é conhecido como "The King of Banana"?',
      option1: 's1mple',
      option2: 'friberg',
      option3: 'GeT_RiGhT',
      option4: 'kennyS',
      correctAnswer: 2,
      category: 'jogadores',
      difficulty: 'difícil',
      tagsJson: JSON.stringify(['jogadores', 'apelidos', 'profissionais'])
    },
    {
      text: 'Qual é o preço da Desert Eagle?',
      option1: '$500',
      option2: '$700',
      option3: '$800',
      option4: '$900',
      correctAnswer: 2,
      category: 'armas',
      difficulty: 'médio',
      tagsJson: JSON.stringify(['armas', 'pistolas', 'economia'])
    },
    {
      text: 'Qual é o nome do sistema de ranqueamento do CS:GO?',
      option1: 'Skill Groups',
      option2: 'Competitive Ranks',
      option3: 'Matchmaking Ranks',
      option4: 'Skill Ranks',
      correctAnswer: 1,
      category: 'sistema',
      difficulty: 'médio',
      tagsJson: JSON.stringify(['sistema', 'ranqueamento'])
    },
    {
      text: 'Qual é o nome da operação mais recente do CS:GO?',
      option1: 'Operation Hydra',
      option2: 'Operation Shattered Web',
      option3: 'Operation Broken Fang',
      option4: 'Operation Riptide',
      correctAnswer: 4,
      category: 'atualizações',
      difficulty: 'difícil',
      tagsJson: JSON.stringify(['atualizações', 'operações'])
    }
  ];

  for (const question of questions) {
    const exists = await prisma.question.findFirst({
      where: { text: question.text }
    });

    if (!exists) {
      await prisma.question.create({
        data: question
      });
      console.log(`Pergunta "${question.text.substring(0, 30)}..." criada com sucesso!`);
    } else {
      console.log(`Pergunta "${question.text.substring(0, 30)}..." já existe, pulando...`);
    }
  }

  console.log('Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });