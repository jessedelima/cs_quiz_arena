const { PrismaClient } = require('@prisma/client');
const { logger } = require('../utils/logger');

// Instância global do Prisma
let prisma = null;

/**
 * Inicializa a conexão com o banco de dados
 */
function initializePrisma() {
  if (!prisma) {
    prisma = new PrismaClient({
      log: [
        {
          emit: 'event',
          level: 'query',
        },
        {
          emit: 'event',
          level: 'error',
        },
        {
          emit: 'event',
          level: 'info',
        },
        {
          emit: 'event',
          level: 'warn',
        },
      ],
      errorFormat: 'pretty',
    });

    // Event listeners para logging
    prisma.$on('query', (e) => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Prisma Query', {
          query: e.query,
          params: e.params,
          duration: `${e.duration}ms`,
          timestamp: e.timestamp
        });
      }
    });

    prisma.$on('error', (e) => {
      logger.error('Prisma Error', {
        message: e.message,
        target: e.target,
        timestamp: e.timestamp
      });
    });

    prisma.$on('info', (e) => {
      logger.info('Prisma Info', {
        message: e.message,
        target: e.target,
        timestamp: e.timestamp
      });
    });

    prisma.$on('warn', (e) => {
      logger.warn('Prisma Warning', {
        message: e.message,
        target: e.target,
        timestamp: e.timestamp
      });
    });

    // Conectar ao banco
    prisma.$connect()
      .then(() => {
        logger.info('Conexão com banco de dados estabelecida');
      })
      .catch((error) => {
        logger.error('Erro ao conectar com banco de dados:', error);
        process.exit(1);
      });
  }
  
  return prisma;
}

/**
 * Middleware para injetar instância do Prisma nas requisições
 */
function prismaMiddleware(req, res, next) {
  if (!prisma) {
    prisma = initializePrisma();
  }
  
  req.prisma = prisma;
  next();
}

/**
 * Middleware para transações automáticas
 * Útil para operações que precisam ser atômicas
 */
function transactionMiddleware(req, res, next) {
  if (!prisma) {
    prisma = initializePrisma();
  }
  
  // Criar uma transação que será usada durante toda a requisição
  req.transaction = async (callback) => {
    return await prisma.$transaction(callback);
  };
  
  req.prisma = prisma;
  next();
}

/**
 * Middleware para operações em lote (batch)
 */
function batchMiddleware(req, res, next) {
  if (!prisma) {
    prisma = initializePrisma();
  }
  
  // Função helper para operações em lote
  req.batch = {
    // Executar múltiplas queries em paralelo
    parallel: async (operations) => {
      return await Promise.all(operations);
    },
    
    // Executar múltiplas queries em sequência
    sequential: async (operations) => {
      const results = [];
      for (const operation of operations) {
        const result = await operation;
        results.push(result);
      }
      return results;
    },
    
    // Executar operações com retry automático
    withRetry: async (operation, maxRetries = 3) => {
      let lastError;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await operation();
        } catch (error) {
          lastError = error;
          
          // Só fazer retry em erros específicos
          if (error.code === 'P2034' || error.code === 'P2024') {
            logger.warn(`Tentativa ${attempt} falhou, tentando novamente...`, {
              error: error.message,
              code: error.code
            });
            
            // Aguardar antes de tentar novamente
            await new Promise(resolve => setTimeout(resolve, attempt * 1000));
            continue;
          }
          
          throw error;
        }
      }
      
      throw lastError;
    }
  };
  
  req.prisma = prisma;
  next();
}

/**
 * Middleware para cache de queries
 */
function cacheMiddleware(req, res, next) {
  if (!prisma) {
    prisma = initializePrisma();
  }
  
  // Cache simples em memória (em produção, usar Redis)
  const cache = new Map();
  
  req.cachedQuery = async (key, queryFn, ttl = 300000) => { // 5 minutos padrão
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      logger.debug(`Cache hit para: ${key}`);
      return cached.data;
    }
    
    const data = await queryFn();
    cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    logger.debug(`Cache miss para: ${key}`);
    return data;
  };
  
  req.prisma = prisma;
  next();
}

/**
 * Middleware para logging de performance de queries
 */
function performanceMiddleware(req, res, next) {
  if (!prisma) {
    prisma = initializePrisma();
  }
  
  // Wrapper para queries com medição de performance
  const originalPrisma = prisma;
  
  req.prisma = new Proxy(originalPrisma, {
    get(target, prop) {
      const original = target[prop];
      
      if (typeof original === 'object' && original !== null) {
        return new Proxy(original, {
          get(modelTarget, modelProp) {
            const modelOriginal = modelTarget[modelProp];
            
            if (typeof modelOriginal === 'function') {
              return async function(...args) {
                const start = Date.now();
                const result = await modelOriginal.apply(modelTarget, args);
                const duration = Date.now() - start;
                
                // Log queries lentas
                if (duration > 1000) {
                  logger.warn('Query lenta detectada', {
                    model: prop,
                    operation: modelProp,
                    duration: `${duration}ms`,
                    path: req.path
                  });
                }
                
                return result;
              };
            }
            
            return modelOriginal;
          }
        });
      }
      
      return original;
    }
  });
  
  next();
}

/**
 * Função para fechar conexão com o banco
 */
async function closePrisma() {
  if (prisma) {
    await prisma.$disconnect();
    logger.info('Conexão com banco de dados fechada');
  }
}

/**
 * Função para verificar saúde da conexão
 */
async function checkDatabaseHealth() {
  try {
    if (!prisma) {
      prisma = initializePrisma();
    }
    
    await prisma.$queryRaw`SELECT 1`;
    return { status: 'healthy', timestamp: new Date().toISOString() };
  } catch (error) {
    logger.error('Erro na verificação de saúde do banco:', error);
    return { 
      status: 'unhealthy', 
      error: error.message, 
      timestamp: new Date().toISOString() 
    };
  }
}

/**
 * Função para obter estatísticas da conexão
 */
function getDatabaseStats() {
  if (!prisma) {
    return { status: 'not_connected' };
  }
  
  return {
    status: 'connected',
    // Adicionar mais estatísticas conforme necessário
  };
}

// Cleanup na saída do processo
process.on('beforeExit', closePrisma);
process.on('SIGINT', closePrisma);
process.on('SIGTERM', closePrisma);

module.exports = {
  initializePrisma,
  prismaMiddleware,
  transactionMiddleware,
  batchMiddleware,
  cacheMiddleware,
  performanceMiddleware,
  closePrisma,
  checkDatabaseHealth,
  getDatabaseStats,
  getPrismaInstance: () => prisma
};