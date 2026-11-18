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
            },
            {
                model: Airports,
                required: true,
                as:'arrivalAirport',
            },
            ],
            });
        return response;
    }

}

module.exports = FlightRepository;