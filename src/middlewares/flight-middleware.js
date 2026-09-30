const { StatusCodes } = require('http-status-codes')

const { AppErrors } = require('../utils/common')
const AppError = require('../utils/errors/app-error')

const  validateFlight = (req,res,next) => {
    if(!req.body.flightNumber || !req.body.airplaneId || !req.body.arrivalAirportId || !req.body.departureAirportId || !req.body.arrivalTime || !req.body.departureTime || !req.body.price || !req.body.boardingGate || !req.body.totalSeats){
            const response = AppErrors("Failed to create airport", new AppError(["some information are not found in the request body"], StatusCodes.BAD_REQUEST));
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(response);
    }
    next()
}

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

    next();
}

module.exports = {
    validateFlight,
    validateFlightSearch,
}