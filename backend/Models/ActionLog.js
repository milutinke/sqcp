'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ActionLog extends Model {}

  ActionLog.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },

      username: {
        type: DataTypes.STRING(96),
        allowNull: false,
      },

      log: {
        type: DataTypes.STRING(2048),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'ActionLog',
      tableName: 'SQP_ActionLogs',
    }
  );

  return ActionLog;
};
