class AppError extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode; // this is the status code that we want to send in the response
        this.explanation = message; // this is the message that we want to send in the response
    }
}

module.exports = AppError;