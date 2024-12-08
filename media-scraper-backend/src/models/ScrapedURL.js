const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');


const ScrapedURL = sequelize.define('ScrapedURL', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  tableName: 'scraped_urls',
});

module.exports = ScrapedURL;
