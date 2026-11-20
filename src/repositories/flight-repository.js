const crudRepository = require('./crud-repository');
const { Op } = require('sequelize');

const { Flights, Airplanes, Airports } = require('../models');

class FlightRepository extends crudRepository {
    constructor() {
        super(Flights);
    }

    async getAllFlights(filter) {
        const response = await Flights.findAll({
            where: filter,
            include: [{
                model: Airplanes,
                required: true,
                as: 'airplane details'
            },
            {
                model: Airports,
                required: true,
                as: 'departureAirport',
            },
            {
                model: Airports,
                required: true,
                as: 'arrivalAirport',
            },
            ],
        });
        return response;
    }
    async findConflictingFlight(airplaneId, departureTime, arrivalTime) {
        return await Flights.findOne({
            where: {
                airplaneId,
                departureTime: {
                    [Op.lt]: arrivalTime
                },
                arrivalTime: {
                    [Op.gt]: departureTime
                }
            }
        });
    }

    async updateFlightSeats(flightId, seats , dec = true){
        const flight = await Flights.findByPk(flightId);
        if (!flight) {
            return null;
        }

        if (dec === true) {
            await flight.decrement('totalSeats', { by: seats });
        } else {
            await flight.increment('totalSeats', { by: seats });
        }

        await flight.reload();
        return flight;
    }

}

module.exports = FlightRepository;