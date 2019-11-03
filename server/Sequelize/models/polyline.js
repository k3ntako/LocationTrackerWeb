'use strict';
module.exports = (sequelize, DataTypes) => {
  const Polyline = sequelize.define('Polyline', {
    id: {
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    code: DataTypes.TEXT,
    order: DataTypes.INTEGER,
    created_at: DataTypes.DATE,
  }, {
    timestamps: false,
  });
  
  Polyline.associate = function(models) {
    Polyline.belongsTo(models.Run, {
      foreignKey: 'run_id'
    });
  };
  return Polyline;
};
