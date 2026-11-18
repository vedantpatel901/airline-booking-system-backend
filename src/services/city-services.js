const { CityRepository } = require('../repositories')

const AppError = require('../utils/errors/app-error');
const { StatusCodes } = require('http-status-codes');

const cityRepository = new CityRepository();

async function createCity(data) {
    try {
        if (!data.name || !data.name.trim()) {
            throw new AppError(
                'City name is required',
                StatusCodes.BAD_REQUEST
            );
        }
        const city = await cityRepository.create(data);
        return city;
    } catch(error) {
        if (error instanceof AppError) {
            throw error;
        }
            if( error.name === 'SequelizeUniqueConstraintError') {
                let explanation = [];
                error.errors.forEach((err) => {
                    explanation.push(err.message);
                });
                throw new AppError(explanation, StatusCodes.BAD_REQUEST);
        }
        throw new AppError('Something went wrong while creating an city', StatusCodes.INTERNAL_SERVER_ERROR);
    }
}

module.exports = {
    createCity,
}