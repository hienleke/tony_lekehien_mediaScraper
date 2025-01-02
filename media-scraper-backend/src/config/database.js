const { Sequelize } = require('sequelize');
const config = require('../config/config.json')

const sequelize = new Sequelize(process.env.databaseURL||config.development.url, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: false,
  },
  logging: console.log, 
});

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

module.exports = sequelize;
