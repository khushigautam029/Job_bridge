import { STATUS_CODES } from "../utils/setConstants";

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
                message: "Validation failed",
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