'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Airports extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.City ,{
        foreignKey : 'cityId',
        onDelete : 'CASCADE',
        onUpdate : 'CASCADE'
      });
      this.hasMany(models.Flights, {
        foreignKey: 'arrivalAirportId',
        onDelete: 'CASCADE',
      });
      this.hasMany(models.Flights, {
        foreignKey: 'departureAirportId',
        onDelete: 'CASCADE',
      });
    }
  }
  Airports.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
      code: { 
        type: DataTypes.STRING,
        allowNull: false,
      },
      address:{ 
        type: DataTypes.STRING,
        allowNull: false,
      },
      cityId: { 
        type: DataTypes.INTEGER,
        allowNull: false}
      },
       {
    sequelize,
    modelName: 'Airports',
  });
  return Airports;
}