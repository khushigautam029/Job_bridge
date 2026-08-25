import { STATUS_CODES } from "../utils/setConstants";

const authorize = (...allowedRoles) => {
    return (req, res, next) => {

        if (!req.user) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false,
                message: "Authentication required",
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: "You are not authorized to access this resource",
            });
        }

        next();
    };
};

export default authorize;