'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Flights extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Airplanes ,{
        foreignKey : 'airplaneId',
        onDelete : 'CASCADE',
        as: 'airplane details',
      });
      this.belongsTo(models.Airports ,{
        foreignKey : 'arrivalAirportId',
        as: 'arrivalAirport',
      });
      this.belongsTo(models.Airports ,{
        foreignKey : 'departureAirportId',
        as: 'departureAirport',
      });

    }
  }
  Flights.init({
     flightNumber: { type: DataTypes.STRING,
      allowNull: false,
    },
     airplaneId: {type:DataTypes.INTEGER,
       allowNull: false,
    },
     arrivalAirportId:{type:DataTypes.INTEGER,
       allowNull: false,
    },
     departureAirportId: {type:DataTypes.INTEGER,
       allowNull: false,
    },
     arrivalTime:{type: DataTypes.DATE,
       allowNull: false,
    },
     departureTime: {type: DataTypes.DATE,
       allowNull: false,
    },
     price: {type:DataTypes.INTEGER,
       allowNull: false,
    },
     boardingGate: { type: DataTypes.STRING,
       allowNull: false,
    },
     totalSeats: {type: DataTypes.INTEGER,
       allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Flights',
  });
  return Flights;
};