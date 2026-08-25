import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Authentication required",
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
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive",
            });
        }

        req.user = user;

        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired",
            });
        }

        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }

        next(error);
    }
};

export default protect;