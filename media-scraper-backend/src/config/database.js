const { Sequelize } = require('sequelize');
const config = require('../config/config.json')

const sequelize = new Sequelize(config.development.url, {
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: true, // Ensure SSL is required
        rejectUnauthorized: false, // Bỏ qua xác minh chứng chỉ SSL
    },
  },
  logging: console.log, // Hiển thị log câu lệnh SQL
});

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced successfully');
  })
  .catch(err => {
    console.error('Error syncing database:', err);
  });

module.exports = sequelize;
