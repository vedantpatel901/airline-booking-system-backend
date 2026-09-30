'use strict';
/** @type {import('sequelize-cli').Migration} */
const { seat_types } = require('../utils/common/enums');
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('seats', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      row: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      col: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      airplaneId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references : {
          model : 'Airplanes',
          key : 'id',
        },
        onDelete : 'CASCADE',
      },
      type:{type: Sequelize.ENUM,
      values: [seat_types.FIRSTCLASS, seat_types.BUSINESS, seat_types.ECONOMY, seat_types.PREMIUM_ECONOMY],
      defaultValue: 'economy',
      allowNull: false
    },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('seats');
  }
};