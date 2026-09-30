'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Flights', 'arrivalAirportId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn('Flights', 'departureAirportId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
    await queryInterface.changeColumn('Flights', 'totalSeats', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('Flights', 'arrivalAirportId', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('Flights', 'departureAirportId', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.changeColumn('Flights', 'totalSeats', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};