import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";

const registerUser = async ({ name, email, password }) => {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
        throw new ApiError(409, "An account with this email already exists");
    }

    const user = await User.create({
        name,
        email: email.toLowerCase(),
        password,
    });

    const token = generateToken(user._id);
    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    };
};

const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    const token = generateToken(user._id);
    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    };
};

export { loginUser, registerUser };