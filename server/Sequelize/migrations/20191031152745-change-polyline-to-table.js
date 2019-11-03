'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Runs', 'polyline', { transaction: t }),
        queryInterface.createTable('Polylines', {
          id: {
            allowNull: false,
            primaryKey: true,
            type: Sequelize.UUID,
          },
          code: {
            allowNull: false,
            type: Sequelize.TEXT,
          },
          order: {
            allowNull: false,
            type: Sequelize.INTEGER,
          },
          run_id: {
            allowNull: false,
            type: Sequelize.UUID,
            references: {
              model: 'Runs',
              key: 'id',
            },
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        }, { transaction: t }),
      ]);
    })
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.dropTable('Polylines', { transaction: t }),
        queryInterface.addColumn('Runs', 'polyline', {
          type: Sequelize.STRING,
        }, { transaction: t }),
      ]);
    })
  },
};
