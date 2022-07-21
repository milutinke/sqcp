'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {}

  Role.init(
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
        unique: {
          args: true,
          msg: 'Role with this name already exists!',
        },
        validate: {
          is: {
            args: /^[a-zA-Z]+$/i,
            msg: 'Name must contain only English alphabet letters!',
          },

          len: {
            args: [3, 20],
            msg: 'Name must be 3 or more characters longer and 20 characters or shorter!',
          },
        },
      },

      permissions: {
        type: DataTypes.STRING(256),
        allowNull: false,
        validate: {
          len: {
            args: [4, 256],
            msg: 'Permissions can be only between 4 and 256 characters long!',
          },

          is: {
            args: /^((startvote|changemap|pause|cheat|private|chat|kick|ban|config|cameraman|immune|manageserver|featuretest|reserve|demos|debug|teamchange|forceteamchange|canseeadminchat|balance),?)+$/g,
            msg: 'Invalid permission specified, pleace check the permissions again!',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'SQP_Roles',
    }
  );

  return Role;
};
