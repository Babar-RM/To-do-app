import { Router } from "express"
import { register, login, logout } from "../controller/auth.controller.js";
import { loginValidator, registerValidator } from "../validators/auth.validator.js";
import validate from "../middleware/validate.middleware.js";
import protect from "../middleware/auth.middleware.js";

const router = Router();
router.post(
    "/register",
    registerValidator, 
    validate, 
    register
);
router.post(
    "/login",
    loginValidator,
    validate,
    login
);
router.post(
    "/logout",
    protect,
    logout
);
export default router;