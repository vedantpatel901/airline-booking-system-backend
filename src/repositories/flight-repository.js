const { Sequelize } = require('sequelize');

const crudRepository = require('./crud-repository');

const { Flights, Airplanes, Airports } = require('../models');

class FlightRepository extends crudRepository{
    constructor(){
        super( Flights );
    }

    async getAllFlights(filter){
        const response = await Flights.findAll({
            where : filter,
            include: [{
                model: Airplanes,
                required: true,
                as : 'airplane details'
            },
            {
                model: Airports,
                required: true,
                as: 'departureAirport',
                on : {
                    col1 : Sequelize.where("Flights.departureAirportId", "=", Sequelize.col("departureAirport.code")),
                }
            },
            {
                model: Airports,
                required: true,
                as:'arrivalAirport',
                on : {
                    col1 : Sequelize.where("Flights.arrivalAirportId", "=", Sequelize.col("arrivalAirport.code")),
                }
            },
            ],
            });
        return response;
    }

}

module.exports = FlightRepository;