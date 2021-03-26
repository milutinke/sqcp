'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ban extends Model {}

  Ban.init(
    {
      name: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },

      steamID: {
        type: DataTypes.STRING(17),
        allowNull: false,
        unique: {
          args: true,
          msg: 'Admin with this SteamID already exists!',
        },
        validate: {
          is: {
            args: /^\d{17}$/i,
            msg: 'Steam ID 64 must be excactly 17 numbers!',
          },
        },
      },

      reason: {
        type: DataTypes.STRING(256),
        allowNull: false,
      },

      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      bannedBy: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Ban',
      tableName: 'SQP_Bans',
    }
  );

  return Ban;
};
