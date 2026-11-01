import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import { registerUser,loginUser } from "../services/auth.services.js";

const register = asyncHandler(async(req, res)=>{
    const {name, email, password} = req.body;
    const result = await registerUser({
        name, 
        email, 
        password,
    });
    res.status(201).json(
        new ApiResponse(
            201,
            "User registered Successfully",
            result
        )
    );
});
const login = asyncHandler(async(req, res)=>{
    const {email, password} = req.body;
    const result = await loginUser({
        email,
        password
    });
    res.status(200).json(
        new ApiResponse(
            200,
            "User Login Successfully",
            result
        )
    );
});
const logout = asyncHandler(async(req, res)=>{
    res.status(201).json(
        new ApiResponse(
            200,
            "Logged out successfully"
        )
    );
});
export {login, register, logout};