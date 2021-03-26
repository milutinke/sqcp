'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SQP_Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        unique: true,
      },

      name: {
        type: Sequelize.STRING(32),
        allowNull: false,
      },

      username: {
        type: Sequelize.STRING(96),
        allowNull: false,
        unique: true,
      },

      password: {
        type: Sequelize.STRING(256),
        allowNull: false,
      },

      isSuperAdmin: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
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
    await queryInterface.dropTable('SQP_Users');
  },
};
