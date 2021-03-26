'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SQP_Bans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },

      name: {
        type: Sequelize.STRING(64),
        allowNull: false,
      },

      steamID: {
        type: Sequelize.STRING(17),
        allowNull: false,
        unique: true,
      },

      reason: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },

      duration: {
        type: Sequelize.INTEGER,
      },

      bannedBy: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SQP_Bans');
  },
};
