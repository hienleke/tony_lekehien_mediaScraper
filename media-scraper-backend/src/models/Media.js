const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Đảm bảo rằng bạn đã cấu hình kết nối với database

const Media = sequelize.define('Media', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false, 
    validate: {
      isIn: [['image', 'video']], 
    },
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false, 
  },
  urlId: {
    type: DataTypes.INTEGER,
    allowNull: false, 
  },
}, {
  timestamps: true, 
  tableName: 'media', 
});

module.exports = Media;
