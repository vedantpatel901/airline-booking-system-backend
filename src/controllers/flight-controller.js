const { StatusCodes } = require("http-status-codes");

const { FlightService } = require('../services');
const { AppErrors, AppSuccess } = require('../utils/common');

async function createFlight(req, res) {
    try {
        console.log("data in controller", req.body);
        const flight = await FlightService.createFlight({
            flightNumber: req.body.flightNumber,
            airplaneId: req.body.airplaneId,
            arrivalAirportId: req.body.arrivalAirportId,
            departureAirportId: req.body.departureAirportId,
            arrivalTime: req.body.arrivalTime,
            departureTime: req.body.departureTime,
            price: req.body.price,
            boardingGate: req.body.boardingGate,
            totalSeats: req.body.totalSeats,
        });
        const response = AppSuccess('Flight created successfully', flight);
        return res
            .status(StatusCodes.CREATED)
            .json(response);
    } catch (error) {
        console.log("error in controller", error);
        const statusCode = error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        const response = AppErrors(error.message, {
            explanation: error.explanation,
            statusCode,
        });
        return res
            .status(statusCode)
            .json(response);
    }
}

async function getAllFlights(req, res) {
    try{
        const flights = await FlightService.getAllFlights(req.query);
        const response = AppSuccess('Flights fetched successfully', flights);
        return res
            .status(StatusCodes.OK)
            .json(response);
    }
    catch (error) {
        console.log("error in controller", error);
        const statusCode = error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        const response = AppErrors(error.message, {
            explanation: error.explanation,
            statusCode,
        });
        return res
            .status(statusCode)
            .json(response);
}
}

async function getFlight(req, res) {
    try {
        const Flight = await FlightService.getFlight(req.params.id);
        const response = AppSuccess('Flight fetched successfully', Flight);
        return res
            .status(StatusCodes.OK)
            .json(response);
    } catch (error) {
        console.log("error in controller", error);
        const statusCode = error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        const response = AppErrors(error.message, {
            explanation: error.explanation,
            statusCode,
        }); 
        return res
            .status(statusCode)
            .json(response);
    }
    next();
}

async function updateFlightSeats(req, res,next) {
    try {
        const flight = await FlightService.updateFlightSeats({
            flightId: req.params.id,
            seats: req.body.seats,
            dec: req.body.dec ?? true
        });
        const response = AppSuccess('Flight seats updated successfully', flight);
        return res
            .status(StatusCodes.OK)
            .json(response);
    } catch (error) {
        console.log("error in controller", error);
        const statusCode = error?.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
        const response = AppErrors(error.message, {
            explanation: error.explanation,
            statusCode,
        }); 
        return res
            .status(statusCode)
            .json(response);
    }
    next();
}

module.exports = {
    createFlight,
    getAllFlights,
    getFlight,
    updateFlightSeats
}