const express = require('express');
const router = express.Router();

const { Flightcontroller } = require('../../controllers');
const { FlightMiddleware } = require('../../middlewares');

router.post('/', FlightMiddleware.validateFlight, Flightcontroller.createFlight);
router.get('/', FlightMiddleware.validateFlightSearch, Flightcontroller.getAllFlights);
router.get('/:id',  Flightcontroller.getFlight);
router.patch('/:id/seats', FlightMiddleware.validateFlightSeatsUpdate, Flightcontroller.updateFlightSeats);

module.exports = router;