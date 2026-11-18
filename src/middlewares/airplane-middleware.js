const { StatusCodes } = require('http-status-codes')

const { AppErrors } = require('../utils/common')
const AppError = require('../utils/errors/app-error')

const  validateAirplane = (req,res,next) => {
    if(typeof req.body.modelNumber !== 'string' ||  typeof req.body.capacity !== 'number' || !req.body.modelNumber || !req.body.capacity){
            const response = AppErrors("Failed to create airplane", new AppError(["model number must be a string or capacity must be a number and both are not found in the request body"], StatusCodes.BAD_REQUEST));
        return res
            .status(StatusCodes.BAD_REQUEST)
            .json(response);
    }
    next()
}
module.exports = {
    validateAirplane 
}