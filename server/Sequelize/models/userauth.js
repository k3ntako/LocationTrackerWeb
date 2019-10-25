'use strict';
module.exports = (sequelize, DataTypes) => {
  const UserAuth = sequelize.define('UserAuth', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    passhash: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {});
  UserAuth.associate = function(models) {
    UserAuth.belongsTo(models.User, {
      foreignKey: 'user_id'
    });
  };
  return UserAuth;
};