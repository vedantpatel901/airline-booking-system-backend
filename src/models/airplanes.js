'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airplanes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Flights ,{
        foreignKey : 'airplaneId',
        onDelete : 'CASCADE',
      });
      this.hasMany(models.seats ,{
        foreignKey : 'airplaneId',
        onDelete : 'CASCADE',
      });
    }
  }
  Airplanes.init({
    modelNumber: { type: DataTypes.STRING, allowNull: false },
    capacity: { type: DataTypes.INTEGER, allowNull: false , validate: { min: 1, max: 200 }, defaultValue: 0 }
  }, {
    sequelize,
    modelName: 'Airplanes',
  });
  return Airplanes;
};