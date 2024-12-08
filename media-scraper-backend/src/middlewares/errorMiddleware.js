const log4js = require('../config/log4jsConfig');
const logger = log4js.getLogger();

const errorMiddleware = (err, req, res, next) => {
  logger.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  res.status(500).json({ error: 'Internal Server Error' });
};

module.exports = errorMiddleware;
