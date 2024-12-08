'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('media', 'url', {
      type: Sequelize.TEXT,  // Change 'url' column type to TEXT
      allowNull: false, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('media', 'url', {
      type: Sequelize.STRING,  // Revert 'url' column type back to STRING
      allowNull: false,
    });
  },
};

