import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {

        if (!req.user) {

            return res.status(
                STATUS_CODES.UNAUTHORIZED
            ).json({
                success: false,
                message: MESSAGES.AUTHENTICATION_REQUIRED,
            });
        }


        const userRole =
            req.user.role?.toUpperCase();

        const normalizedAllowedRoles =
            allowedRoles.map((role) =>
                role.toUpperCase()
            );


        if (
            !normalizedAllowedRoles.includes(
                userRole
            )
        ) {

            return res.status(
                STATUS_CODES.FORBIDDEN
            ).json({
                success: false,
                message:MESSAGES.APPLICATION_NOT_AUTHORIZED_TO_ACCESS,
            });
        }


        next();
    };
};

export default authorizeRoles;