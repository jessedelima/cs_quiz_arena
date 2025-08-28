const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Criar diretório de logs se não existir
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Configurar formatos personalizados
const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: 'YYYY-MM-DD HH:mm:ss'
  }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({
    format: 'HH:mm:ss'
  }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    // Adicionar metadados se existirem
    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Configurar transports
const transports = [
  // Console transport para desenvolvimento
  new winston.transports.Console({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: consoleFormat,
    handleExceptions: true,
    handleRejections: true
  }),
  
  // Arquivo para todos os logs
  new winston.transports.File({
    filename: path.join(logsDir, 'app.log'),
    level: 'info',
    format: logFormat,
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    tailable: true
  }),
  
  // Arquivo específico para erros
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
    format: logFormat,
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 5,
    tailable: true
  }),
  
  // Arquivo para logs de auditoria (autenticação, transações, etc.)
  new winston.transports.File({
    filename: path.join(logsDir, 'audit.log'),
    level: 'info',
    format: logFormat,
    maxsize: 10 * 1024 * 1024, // 10MB
    maxFiles: 10,
    tailable: true
  })
];

// Criar logger principal
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports,
  exitOnError: false
});

// Logger específico para auditoria
const auditLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'audit.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 10,
      tailable: true
    })
  ]
});

// Logger para performance
const performanceLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logsDir, 'performance.log'),
      maxsize: 5 * 1024 * 1024,
      maxFiles: 3,
      tailable: true
    })
  ]
});

// Funções auxiliares para logs estruturados
const logAuth = (action, userId, details = {}) => {
  auditLogger.info('AUTH_EVENT', {
    action,
    userId,
    timestamp: new Date().toISOString(),
    ip: details.ip,
    userAgent: details.userAgent,
    ...details
  });
};

const logTransaction = (type, userId, amount, details = {}) => {
  auditLogger.info('TRANSACTION_EVENT', {
    type,
    userId,
    amount,
    timestamp: new Date().toISOString(),
    ...details
  });
};

const logGameEvent = (event, gameId, userId, details = {}) => {
  logger.info('GAME_EVENT', {
    event,
    gameId,
    userId,
    timestamp: new Date().toISOString(),
    ...details
  });
};

const logPerformance = (operation, duration, details = {}) => {
  performanceLogger.info('PERFORMANCE_METRIC', {
    operation,
    duration,
    timestamp: new Date().toISOString(),
    ...details
  });
};

const logSecurity = (event, severity, details = {}) => {
  const logLevel = severity === 'high' ? 'error' : severity === 'medium' ? 'warn' : 'info';
  
  logger[logLevel]('SECURITY_EVENT', {
    event,
    severity,
    timestamp: new Date().toISOString(),
    ...details
  });
};

// Middleware para logging de requisições HTTP
const httpLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log da requisição
  logger.info('HTTP_REQUEST', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id
  });
  
  // Interceptar o final da resposta
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    
    // Log da resposta
    logger.info('HTTP_RESPONSE', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
      userId: req.user?.id
    });
    
    // Log de performance se demorou muito
    if (duration > 1000) {
      logPerformance('SLOW_REQUEST', duration, {
        method: req.method,
        url: req.url,
        statusCode: res.statusCode
      });
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

// Middleware para capturar erros não tratados
const errorLogger = (err, req, res, next) => {
  logger.error('UNHANDLED_ERROR', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userId: req.user?.id,
    body: req.body,
    query: req.query,
    params: req.params
  });
  
  next(err);
};

// Função para limpar logs antigos
const cleanOldLogs = () => {
  const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 dias
  const now = Date.now();
  
  fs.readdir(logsDir, (err, files) => {
    if (err) return;
    
    files.forEach(file => {
      const filePath = path.join(logsDir, file);
      fs.stat(filePath, (err, stats) => {
        if (err) return;
        
        if (now - stats.mtime.getTime() > maxAge) {
          fs.unlink(filePath, (err) => {
            if (!err) {
              logger.info(`Log antigo removido: ${file}`);
            }
          });
        }
      });
    });
  });
};

// Executar limpeza de logs diariamente
setInterval(cleanOldLogs, 24 * 60 * 60 * 1000);

module.exports = {
  logger,
  auditLogger,
  performanceLogger,
  logAuth,
  logTransaction,
  logGameEvent,
  logPerformance,
  logSecurity,
  httpLogger,
  errorLogger
};