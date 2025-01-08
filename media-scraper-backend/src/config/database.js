const { Sequelize } = require('sequelize');
const config = require('../config/config.json')
const fs = require('fs');
const sslCaContent = fs.readFileSync(process.env.SSL_CA_PATH).toString();
const sequelize = new Sequelize(process.env.databaseURL || config.development.url, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      ca: sslCaContent,
      rejectUnauthorized: true,  // Ensure that the certificate is validated
    },
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
