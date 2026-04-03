export const errorHandler = (err, req, res, next) => {
    console.error(`[Error] ${err.message}`);
    
    const statusCode = err.statusCode || 500;
    
    // Centralized uniform response structure
    res.status(statusCode).json({
        success: false,
        status: statusCode,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};
