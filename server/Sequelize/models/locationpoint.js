'use strict';
module.exports = (sequelize, DataTypes) => {
  const LocationPoint = sequelize.define('LocationPoint', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    time: DataTypes.DATE
  }, {});
  LocationPoint.associate = function(models) {
    LocationPoint.belongsTo(models.Run, {
      foreignKey: 'run_id'
    });
  };
  return LocationPoint;
};
