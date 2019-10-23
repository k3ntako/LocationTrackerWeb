'use strict';
module.exports = (sequelize, DataTypes) => {
  const Run = sequelize.define('Run', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    name: DataTypes.STRING,
  }, {});
  Run.associate = function(models) {
    Run.belongsTo(models.User);

    Run.hasOne(models.LocationPoint, {
      foreignKey: 'run_id',
      as: 'locationPoints'
    });
  };
  return Run;
};