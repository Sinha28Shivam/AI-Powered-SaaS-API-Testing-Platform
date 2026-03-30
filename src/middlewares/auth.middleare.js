import jwt from "jsonwebtoken";
import { createError } from "../utils/customError.js";

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return next(createError("No valid token provided", 401));
    }

    const token = authHeader.split(" ")[1]; // Remove "Bearer " prefix

    if(!token) {
        return next(createError("No token provided", 401));
    }
    

    try{
        const decoded = jwt.verify(token, "secretkey");
        req.user = decoded;
        next();
    }catch(err) {
        return next(createError("Invalid token", 401));
    }
};