'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
  }, {
    indexes: [
      { unique: true, fields: ['email'] }
    ],
  });

  User.prototype.toPublicJSON = function () {
    const values = Object.assign({}, this.get());
    const {id, email, first_name, last_name} = values;

    return { id, email, first_name, last_name };
  };

  User.associate = function(models) {
    User.hasMany(models.Run, {
      foreignKey: 'user_id',
      as: 'runs'
    });

    User.hasOne(models.UserAuth, {
      foreignKey: 'user_id',
      as: 'auth'
    });
  };
  return User;
};
