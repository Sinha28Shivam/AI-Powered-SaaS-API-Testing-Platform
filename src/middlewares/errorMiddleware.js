export const errorHandler = (err, req, res, next) => {
    console.log("[ERROR]", err.message);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
};