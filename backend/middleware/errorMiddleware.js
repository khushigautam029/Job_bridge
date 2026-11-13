import multer from "multer";
import {
    sendError,
} from "../utils/responseHandler.js";
import {
    MESSAGES,
    STATUS_CODES,
} from "../utils/setConstants.js";

const errorMiddleware = (err, req, res, next) => {
    console.error(err);
    // Multer upload errors
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return sendError(
                res,
                STATUS_CODES.BAD_REQUEST,
                "Resume file size must not exceed 5 MB."
            );
        }
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            err.message
        );
    }

    // Invalid file type
    if (err.message === "Only PDF and DOCX resume files are allowed") {
        return sendError(
            res,
            STATUS_CODES.BAD_REQUEST,
            err.message
        );
    }

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
