const express = require('express');
const cors = require('cors');
const { prismaMiddleware } = require('./src/middleware/prisma');
const { logger } = require('./src/utils/logger');
const authRoutes = require('./src/routes/auth');

const app = express();
const PORT = process.env.PORT || 8000;

// Middlewares básicos
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware do Prisma
app.use(prismaMiddleware);

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Rotas de autenticação
app.use('/api/v1/auth', authRoutes);

// Rota de teste
app.get('/api/v1/test', async (req, res) => {
  try {
    // Testar conexão com banco
    const userCount = await req.prisma.user.count();
    
    res.json({
      message: 'Backend funcionando!',
      database: 'conectado',
      userCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Erro no teste:', error);
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// Middleware de erro
app.use((err, req, res, next) => {
  logger.error('Erro não tratado:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  logger.info(`Servidor backend rodando na porta ${PORT}`);
  logger.info(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`CORS habilitado para: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});

module.exports = app;