const { StatusCodes } = require('http-status-codes')

const { AppErrors } = require('../utils/common')
const AppError = require('../utils/errors/app-error')


const validateFlight = (req, res, next) => {
    const {
        flightNumber,
        airplaneId,
        arrivalAirportId,
        departureAirportId,
        arrivalTime,
        departureTime,
        price,
        boardingGate,
        totalSeats
    } = req.body;

    const errors = [];

    // Required fields
    if (
        !flightNumber?.trim() ||
        !airplaneId ||
        !arrivalAirportId ||
        !departureAirportId ||
        !arrivalTime ||
        !departureTime ||
        price === undefined ||
        price === null ||
        !boardingGate?.trim() ||
        totalSeats === undefined ||
        totalSeats === null
    ) {
        errors.push('All flight fields are required');
    }

    // Positive integer IDs
    if (![airplaneId, arrivalAirportId, departureAirportId]
        .every(id => Number.isInteger(Number(id)) && Number(id) > 0)) {
        errors.push('Airplane and airport IDs must be positive integers');
    }

    // Different departure and arrival airports
    if (
        Number(arrivalAirportId) === Number(departureAirportId)
    ) {
        errors.push('Departure and arrival airports must be different');
    }

    // Valid dates
    const departure = new Date(departureTime);
    const arrival = new Date(arrivalTime);

    if (
        !arrivalTime || !departureTime ||
        isNaN(departure.getTime()) ||
        isNaN(arrival.getTime())
    ) {
        errors.push('Invalid departure or arrival date');
    } else if (arrival <= departure) {
        errors.push('Arrival time must be later than departure time');
    }

    // Positive price
    if (!Number.isFinite(Number(price)) || Number(price) <= 0) {
        errors.push('Price must be a positive number');
    }

    // Positive integer seats
    if (!Number.isInteger(Number(totalSeats)) || Number(totalSeats) <= 0) {
        errors.push('Total seats must be a positive integer');
    }

    if (errors.length > 0) {
        const response = AppErrors(
            'Failed to create flight',
            new AppError(errors, StatusCodes.BAD_REQUEST)
        );

        return res.status(StatusCodes.BAD_REQUEST).json(response);
    }

    next();
};


const validateFlightSearch = (req, res, next) => {
    const airportIds = [req.query.departureAirportId, req.query.arrivalAirportId];
    const hasInvalidAirportId = airportIds.some((id) => id !== undefined && !/^[1-9]\d*$/.test(id));

    if (hasInvalidAirportId) {
        const response = AppErrors(
            'Airport ids must be positive integers',
            new AppError(['Invalid flight search parameters'], StatusCodes.BAD_REQUEST)
        );
        return res.status(StatusCodes.BAD_REQUEST).json(response);
    }
    if (req.query.departureDate) {
    const date = req.query.departureDate;

    const isValidDate =
        /^\d{4}-\d{2}-\d{2}$/.test(date) &&
        !isNaN(Date.parse(`${date}T00:00:00.000Z`)) &&
        new Date(`${date}T00:00:00.000Z`).toISOString().startsWith(date);

    if (!isValidDate) {
        const response = AppErrors(
            'Invalid departure date',
            new AppError(['Date must be in YYYY-MM-DD format'], StatusCodes.BAD_REQUEST)
        );

        return res.status(StatusCodes.BAD_REQUEST).json(response);
    }
}

const { minPrice, maxPrice } = req.query;

if (minPrice !== undefined && (!/^\d+$/.test(minPrice) || Number(minPrice) <= 0)) {
    return res.status(StatusCodes.BAD_REQUEST).json(
        AppErrors('Invalid minimum price', new AppError(
            ['minPrice must be a positive number'],
            StatusCodes.BAD_REQUEST
        ))
    );
}

if (maxPrice !== undefined && (!/^\d+$/.test(maxPrice) || Number(maxPrice) <= 0)) {
    return res.status(StatusCodes.BAD_REQUEST).json(
        AppErrors('Invalid maximum price', new AppError(
            ['maxPrice must be a positive number'],
            StatusCodes.BAD_REQUEST
        ))
    );
}

if (minPrice !== undefined && maxPrice !== undefined && Number(minPrice) > Number(maxPrice)) {
    return res.status(StatusCodes.BAD_REQUEST).json(
        AppErrors('Invalid price range', new AppError(
            ['minPrice cannot be greater than maxPrice'],
            StatusCodes.BAD_REQUEST
        ))
    );
}

    next();
}

module.exports = {
    validateFlight,
    validateFlightSearch,
}