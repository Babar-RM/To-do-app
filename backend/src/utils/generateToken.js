import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || process.env.ACCESS_TOKEN_SECRET || "super_secret_jwt_key_todo_app_2026_!@#$";
    const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

    return jwt.sign(
        {
            id: userId,
        },
        secret,
        {
            expiresIn,
        }
    );
};

export default generateToken;