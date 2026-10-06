import {
    sendError,
} from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES,
} from "../utils/setConstants.js";

const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    // Handle Sequelize unique constraint errors
    if (err.name === "SequelizeUniqueConstraintError") {
        // Duplicate phone number
        if (err.fields?.phone) {
            return sendError(
                res,
                STATUS_CODES.CONFLICT,
                MESSAGES.PHONE_ALREADY_REGISTERED
            );
        }
        // Duplicate email
        if (err.fields?.email) {
            return sendError(
                res,
                STATUS_CODES.CONFLICT,
                MESSAGES.EMAIL_ALREADY_REGISTERED
            );
        }
    }
    const statusCode = err.statusCode || STATUS_CODES.INTERNAL_SERVER_ERROR;
    return sendError(
        res,
        statusCode,
        err.message || MESSAGES.INTERNAL_SERVER_ERROR
    );
};

export default errorMiddleware;
