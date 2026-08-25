import { STATUS_CODES } from "../utils/setConstants";

const notFoundMiddleware = (req, res) => {
    res.status(STATUS_CODES.NOT_FOUND).json({
        success: false,
        message: `Route not found: ${req.method} ${req.originalUrl}`,
    });
};

export default notFoundMiddleware;