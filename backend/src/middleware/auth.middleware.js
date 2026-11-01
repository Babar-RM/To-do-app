import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/User.js";

const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer ")
    ) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
        throw new ApiError(401, "Access denied, no token provided");
    }

    try {
        const secret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || "super_secret_jwt_key_todo_app_2026_!@#$";
        const decoded = jwt.verify(token, secret);
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            throw new ApiError(401, "User not found or session expired");
        }

        req.user = user;
        next();
    } catch (err) {
        throw new ApiError(401, err.message || "Invalid or expired token");
    }
});

export default protect;