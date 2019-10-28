'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn('Runs', 'polyline', {
          type: Sequelize.STRING
        }, { transaction: t }),
        queryInterface.addColumn('Runs', 'polyline_updated_at', {
          type: Sequelize.DATE,
        }, { transaction: t }),
        queryInterface.addColumn('Runs', 'done', {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        }, { transaction: t }),
      ]);
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('Runs', 'polyline', { transaction: t }),
        queryInterface.removeColumn('Runs', 'polyline_updated_at', { transaction: t }),
        queryInterface.removeColumn('Runs', 'done', { transaction: t }),
      ])
    })
  }
};
