const log4js = require('log4js');

log4js.configure({
  appenders: {
    dateFile: {
      type: 'dateFile',
      filename: 'logs/app-',
      pattern: 'yyyy-MM-dd.log', 
      alwaysIncludePattern: true, 
      compress: true, 
      daysToKeep: 7, 
    },
    console: { type: 'console' } 
  },
  categories: {
    default: { appenders: ['dateFile', 'console'], level: 'info' }
  }
});

module.exports = log4js;
