'use strict';
const {
  Model
} = require('sequelize');

const { seat_types } = require('../utils/common/enums');
module.exports = (sequelize, DataTypes) => {
  class seats extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
       this.belongsTo(models.Airplanes ,{
        foreignKey : 'airplaneId',
      });
    }
  }
  seats.init({
    row: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    col: {
      type: DataTypes.STRING,
      allowNull: false
    },
    airplaneId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type:{
      type: DataTypes.ENUM,
      values: [seat_types.FIRSTCLASS, seat_types.BUSINESS, seat_types.ECONOMY, seat_types.PREMIUM_ECONOMY],
      defaultValue: 'economy',
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'seats',
  });
  return seats;
};