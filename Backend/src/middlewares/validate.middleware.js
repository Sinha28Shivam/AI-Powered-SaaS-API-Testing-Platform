export const validate = (schema) => (req, res, next) => {
    try {
        req.body = schema.parse(req.body);
        next();
    } catch (err) {
        res.status(400).json({
            success: false,
            message: "Validation Error",
            errors: err.errors.map(e => ({
                field: e.path[0],
                message: e.message
            }))
        });
    }
};