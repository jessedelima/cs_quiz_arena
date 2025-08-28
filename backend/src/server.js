const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Importar middlewares e rotas
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');
const socketHandler = require('./socket/socketHandler');

// Importar rotas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const gameRoomRoutes = require('./routes/gameRooms');
const quizRoutes = require('./routes/quiz');
const tournamentRoutes = require('./routes/tournaments');
const transactionRoutes = require('./routes/transactions');
const adminRoutes = require('./routes/admin');

// Inicializar Prisma
const prisma = new PrismaClient();

// Criar aplicação Express
const app = express();
const server = http.createServer(app);

// Configurar Socket.IO
const io = socketIo(server, {
  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Configurações de segurança
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Configurar CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  credentials: true
}));

// Configurar compressão
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // máximo 100 requests por IP
  message: {
    error: 'Muitas tentativas. Tente novamente em alguns minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Middleware para parsing de JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware para logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });
  next();
});

// Disponibilizar Prisma e Socket.IO para as rotas
app.use((req, res, next) => {
  req.prisma = prisma;
  req.io = io;
  next();
});

// Rotas de saúde
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', async (req, res) => {
  try {
    // Testar conexão com o banco
    await prisma.$queryRaw`SELECT 1`;
    
    res.json({
      status: 'OK',
      database: 'connected',
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || 'v1'
    });
  } catch (error) {
    logger.error('Health check failed:', error);
    res.status(503).json({
      status: 'ERROR',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Configurar rotas da API
const apiRouter = express.Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/users', authMiddleware, userRoutes);
apiRouter.use('/game-rooms', authMiddleware, gameRoomRoutes);
apiRouter.use('/quiz', authMiddleware, quizRoutes);
apiRouter.use('/tournaments', authMiddleware, tournamentRoutes);
apiRouter.use('/transactions', authMiddleware, transactionRoutes);
apiRouter.use('/admin', authMiddleware, adminRoutes);

app.use('/api/v1', apiRouter);

// Rota para servir arquivos estáticos (uploads)
app.use('/uploads', express.static('uploads'));

// Rota 404 para API
app.use('/api/*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint não encontrado',
    code: 'ENDPOINT_NOT_FOUND',
    path: req.path
  });
});

// Configurar Socket.IO
socketHandler(io, prisma);

// Middleware de tratamento de erros
app.use(errorHandler);

// Função para inicializar o servidor
async function startServer() {
  try {
    // Conectar ao banco de dados
    await prisma.$connect();
    logger.info('Conectado ao banco de dados PostgreSQL');

    // Iniciar servidor
    const PORT = process.env.PORT || 8000;
    server.listen(PORT, () => {
      logger.info(`🚀 Servidor rodando na porta ${PORT}`);
      logger.info(`📊 Dashboard: http://localhost:${PORT}/health`);
      logger.info(`🔌 WebSocket: ws://localhost:${PORT}`);
      logger.info(`🌍 Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });

    // Inicializar serviços em background
    require('./services/tournamentScheduler');
    require('./services/cleanupService');
    
  } catch (error) {
    logger.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Tratamento de sinais de encerramento
process.on('SIGTERM', async () => {
  logger.info('Recebido SIGTERM, encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('Recebido SIGINT, encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
  logger.error('Erro não capturado:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promise rejeitada não tratada:', { reason, promise });
  process.exit(1);
});

// Iniciar servidor
startServer();

module.exports = { app, server, io, prisma };