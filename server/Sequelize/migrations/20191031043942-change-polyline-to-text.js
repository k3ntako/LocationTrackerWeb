'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'Runs',
      'polyline',
      {
        type: Sequelize.TEXT,
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(
      'Runs',
      'polyline',
      {
        type: Sequelize.STRING,
      }
    )
  }
};
