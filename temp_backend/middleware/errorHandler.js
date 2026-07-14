const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Mongoose bad ObjectId
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Resource not found with id of ${err.value}`;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        statusCode = 400;
        message = `${field} already exists. Please use another.`;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors).map(val => val.message).join(", ");
    }

    //Multer file upload error
    if (err.name === "MulterError") {
        statusCode = 400;
        message = err.message;
    }

    // Gemini API rate limit
    if (err.statusCode === 429) {
        statusCode = 429;
        message = err.message;
    }

    // JWT error
    if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token. Please log in again.";
    }

    if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Your token has expired. Please log in again.";
    }

    console.error("Error:", {
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    })

    res.status(statusCode).json({
        success: false,
        error: message,
        statusCode: statusCode,
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
}

export default errorHandler;