'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    static associate(models) {
      this.belongsTo(models.Role, {
        onDelete: 'CASCADE',
      });
    }
  }

  Admin.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },

      name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: {
          args: true,
          msg: 'Admin with this name already exists!',
        },
        validate: {
          len: {
            args: [3, 64],
            msg: 'Name must be 3 or more characters longer and 64 characters or shorter!',
          },
        },
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
    },
    {
      sequelize,
      modelName: 'Admin',
      tableName: 'SQP_Admins',
    }
  );

  return Admin;
};
