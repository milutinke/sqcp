'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('SQP_Admins', 'RoleId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'SQP_Roles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('SQP_Admins', 'RoleId');
  },
};
