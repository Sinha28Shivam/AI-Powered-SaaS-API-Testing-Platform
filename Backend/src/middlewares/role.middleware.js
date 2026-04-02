export const checkRole = (role) => {
    return (req, res, next) => {
        if(req.user.role !== role) {
            return res.send("Unauthorized Access");
        }
        next();
    };
};