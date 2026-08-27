import jwt from "jsonwebtoken";
import { User } from "../models/index.js";
import { MESSAGES, STATUS_CODES } from "../utils/setConstants.js";

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.AUTHENTICATION_REQUIRED,
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        const user = await User.findByPk(decoded.id, {
            attributes: {
                exclude: ["password"],
            },
        });

        if (!user) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.USER_NOT_FOUND,
            });
        }

        if (!user.isActive) {
            return res.status(STATUS_CODES.FORBIDDEN).json({
                success: false,
                message: MESSAGES.ACCOUNT_INACTIVE,
            });
        }

        req.user = user;

        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.TOKEN_EXPIRED,
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                success: false,
                message: MESSAGES.INVALID_TOKEN,
            });
        }

        next(error);
    }
};

export default protect;