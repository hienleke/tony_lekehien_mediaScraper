const log4js = require('../config/log4jsConfig');
const logger = log4js.getLogger();

const loggerMiddleware = (req, res, next) => {
  logger.info(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  res.on('finish', () => {
    logger.info(`Response status: ${res.statusCode}`);
  });

  next();
};

module.exports = loggerMiddleware;
