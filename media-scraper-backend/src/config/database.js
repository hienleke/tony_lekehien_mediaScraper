const { Sequelize } = require('sequelize');
const config = require('../config/config.json')
const fs = require('fs');
const sequelize = new Sequelize(process.env.databaseURL || config.development.url, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      ca: fs.readFileSync(process.env.SSL_CA_PATH).toString(),
      rejectUnauthorized: true,  // Ensure that the certificate is validated
    },
  },
  logging: console.log,
});
console.log("asdfdas   :",   process.env.SSL_CA_PATH);
const sslCaContent = fs.readFileSync(process.env.SSL_CA_PATH).toString();
console.log(" data 1  2 43 :",sslCaContent)
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

module.exports = sequelize;
