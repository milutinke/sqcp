'use strict';
const { Model } = require('sequelize');
const Logger = require('../Utils/Logger');
const BCrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // Class methods
    static async hashUserPassword(user) {
      user.password = await BCrypt.hash(user.password, await BCrypt.genSalt(10));

      return user;
    }

    static async comparePasswords(user, password) {
      return await BCrypt.compare(password, user.password);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },

      name: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          len: {
            args: [3, 32],
            msg: 'Name must be 3 or more characters longer and 32 characters or shorter!',
          },
        },
      },

      username: {
        type: DataTypes.STRING(96),
        unique: {
          args: true,
          msg: 'The provided username is already in use with another user!',
        },
        allowNull: false,
        validate: {
          len: {
            args: [3, 64],
            msg: 'Username must be 3 or more characters longer and 64 characters or shorter!',
          },
          is: {
            args: /^[a-zA-Z0-9.]+$/i,
            msg: 'Username can only have lathin alplabet characters, numbers and a dot in them!',
          },
        },
      },

      password: {
        type: DataTypes.STRING(256),
        allowNull: false,
        validate: {
          notEmpty: {
            args: true,
            msg: 'You must provide a valid password!',
          },
        },
      },

      isSuperAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'SQP_Users',
    }
  );

  // Hash user password before storing/updating the user in the DB
  User.beforeCreate(async (user, options) => {
    try {
      return await User.hashUserPassword(user);
    } catch (error) {
      Logger.verbose('DataBase', 1, `Error: ${error}`);
      throw new Error(error);
    }
  });

  User.beforeUpdate(async (user, options) => {
    try {
      if (user.__noChange) return user;
      return await User.hashUserPassword(user);
    } catch (error) {
      Logger.verbose('DataBase', 1, `Error: ${error}`);
      throw new Error(error);
    }
  });

  return User;
};
