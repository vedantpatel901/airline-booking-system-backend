const { AirplaneRepository } = require('../repositories')
const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');
const { Airplanes } = require('../models');

const airplaneRepository = new AirplaneRepository();

async function createAirplane(data) {
    try {
        if (
            typeof data.capacity !== 'number' ||
            typeof data.modelNumber !== 'string'
        ) {
            throw new AppError(
                'capacity must be a number and modelNumber must be a string',
                StatusCodes.BAD_REQUEST
            );
        }
        data.modelNumber = data.modelNumber.trim();
        const existingAirplane = await Airplanes.findOne({
            where: { modelNumber: data.modelNumber.trim() }
        });

        if (existingAirplane) {
            throw new AppError(
                'Airplane with this model number already exists',
                StatusCodes.CONFLICT
            );
        }
        const airplane = await airplaneRepository.create(data);
        return airplane;
    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        if (error.name == 'SequelizeValidationError') {
            let explanation = [];
            error.errors.forEach((err) => {
                explanation.push(err.message);
            });
            throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Something went wrong while creating an airplane', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirplane() {
    try {
        const airplanes = await airplaneRepository.getAll();
        return airplanes;
    }
    catch (error) {
        throw new AppError('cannot fetch airplanes', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function getAirplanes(id) {
    try {
        const airplanes = await airplaneRepository.getdatabypk(id);
        if (!airplanes) {
            throw new AppError('airplane not found', StatusCodes.NOT_FOUND);
        }
        return airplanes;
    }
    catch (error) {
        if (error instanceof AppError) {
            throw error;
        }
        throw new AppError('cannot fetch airplanes', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

async function updateAirplane(id, data) {
    try {
        const airplane = await airplaneRepository.getdatabypk(id);
        if (!airplane) {
            throw new AppError(
                'airplane not found',
                StatusCodes.NOT_FOUND
            );
        }

        if (
            typeof data.modelNumber !== 'string' ||
            data.modelNumber.trim() === ''
        ) {
            throw new AppError(
                'modelNumber is required and must be a non-empty string',
                StatusCodes.BAD_REQUEST
            );
        }

        if (
            typeof data.capacity !== 'number' ||
            !Number.isInteger(data.capacity) ||
            data.capacity < 1 ||
            data.capacity > 200
        ) {
            throw new AppError(
                'capacity must be an integer between 1 and 200',
                StatusCodes.BAD_REQUEST
            );
        }

        const modelNumber = data.modelNumber.trim();

        const existingAirplane = await Airplanes.findOne({
            where: {
                modelNumber
            }
        });

        if (
            existingAirplane &&
            existingAirplane.id !== airplane.id
        ) {
            throw new AppError(
                'Airplane with this model number already exists',
                StatusCodes.CONFLICT
            );
        }

  
        const updatedAirplane = await airplane.update({
            modelNumber,
            capacity: data.capacity
        });

        return updatedAirplane;

    } catch (error) {
        if (error instanceof AppError) {
            throw error;
        }

        if (
            error.name === 'SequelizeValidationError' ||
            error.name === 'SequelizeUniqueConstraintError'
        ) {
            throw new AppError(
                error.errors.map(err => err.message),
                StatusCodes.BAD_REQUEST
            );
        }

        throw new AppError(
            'cannot update airplane',
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}


module.exports = {
    createAirplane,
    getAirplane,
    getAirplanes,
    updateAirplane,
}
