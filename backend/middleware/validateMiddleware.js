import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

const validate = (schema) => {
    return (req, res, next) => {

        const { error, value } = schema.validate(
            req.body,
            {
                abortEarly: false,
                stripUnknown: true,
            }
        );
        if (error) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                success: false,
                message: MESSAGES.VALIDATION_FAILED,
                errors: error.details.map(
                    (detail) => detail.message
                ),
            });
        }
        req.body = value;
        next();
    };
};

export default validate;