export const sendSuccess = (
    res,
    statusCode,
    message,
    data = null
) => {
    return res.status(statusCode).json({
        success: true,
        statusCode,
        message,
        ...(data !== null && { data })
    });
};

export const sendError = (
    res,
    statusCode,
    message,
    errors = null
) => {
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        ...(errors && { errors })
    });
};