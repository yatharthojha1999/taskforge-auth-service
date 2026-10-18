module.exports = function errorHandler(error, req, res, next) {
    if (res.headersSent) {
        return next(error);
    }

    const statusCode = error.statusCode || 500;

    if (statusCode >= 500) {
        console.error("Unexpected server error:", error);
    }

    return res.status(statusCode).json({
        message:
            statusCode >= 500
                ? "Internal server error."
                : error.message,
    });
};