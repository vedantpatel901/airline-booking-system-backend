const { FlightRepository, AirplaneRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { Op } = require('sequelize');

const flightRepository = new FlightRepository();
const airplaneRepository = new AirplaneRepository();

async function createFlight(data) {
    try {
        // Check whether airplane exists
        const airplane = await airplaneRepository.getdatabypk(data.airplaneId);

        if (!airplane) {
            throw new AppError('Airplane does not exist', StatusCodes.NOT_FOUND);
        }

        // Check airplane capacity
        if (data.totalSeats > airplane.capacity) {
            throw new AppError(
                `Total seats cannot exceed airplane capacity of ${airplane.capacity}`,
                StatusCodes.BAD_REQUEST
            );
        }

        // Check overlapping flight schedule
        const existingFlight = await flightRepository. (
            data.airplaneId,
            data.departureTime,
            data.arrivalTime
        );

        if (existingFlight) {
            throw new AppError(
                'This airplane already has a flight scheduled during this time',
                StatusCodes.CONFLICT
            );
        }

        return await flightRepository.create(data);

    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        if (error.name === 'SequelizeValidationError') {
            const explanation = error.errors.map(err => err.message);
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }

        if (error.name === 'SequelizeForeignKeyConstraintError') {
            throw new AppError(
                'Invalid airplaneId or airport IDs provided',
                StatusCodes.BAD_REQUEST
            );
        }

        throw new AppError(
            'Something went wrong while creating a flight',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}

async function getAllFlights(query) {
    const customFilter = {};

    if (query.departureAirportId) {
        customFilter.departureAirportId = query.departureAirportId;
    }
    if (query.arrivalAirportId) {
        customFilter.arrivalAirportId = query.arrivalAirportId;
    }
    if (query.departureDate) {
        const startDate = new Date(`${query.departureDate}T00:00:00.000Z`);
        const endDate = new Date(startDate);

        endDate.setUTCDate(endDate.getUTCDate() + 1);

        customFilter.departureTime = {
            [Op.gte]: startDate,
            [Op.lt]: endDate
        };
    }

    if (query.minPrice || query.maxPrice) {
        customFilter.price = {};

        if (query.minPrice) {
            customFilter.price[Op.gte] = Number(query.minPrice);
        }

        if (query.maxPrice) {
            customFilter.price[Op.lte] = Number(query.maxPrice);
        }
    }

    try {
        const flights = await flightRepository.getAllFlights(customFilter);
        return flights;
    }
    catch (error) {
        console.log("error in service", error);
        throw new AppError('cannot fetch flights', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createFlight,
    getAllFlights
};
