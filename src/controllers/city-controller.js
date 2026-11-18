const { StatusCodes } = require("http-status-codes");

const { CityService } = require('../services')
const { AppErrors,AppSuccess } = require('../utils/common');

async function createCity(req,res){
    try{
        const city = await CityService.createCity({
            name: req.body?.name,
        });
        const response = AppSuccess('City created successfully', city);
        return res
        .status(StatusCodes.CREATED)
        .json(response);   
    }catch(error){
          console.log("ERROR:", error);
    console.log("STATUS CODE:", error.statusCode);
        const response = AppErrors(error.message, {
            explanation: error.explanation,
            statusCode: error.statusCode,
        });
       return res
        .status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR) 
        .json(response);
    }
}

module.exports = {
    createCity,
}