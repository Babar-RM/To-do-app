import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";
import { createTodoValidator, updateTodoValidator } from "../validators/todo.validator.js";
import {
    createTodo,
    getTodos,
    getTodoById,
    updateTodo,
    deleteTodo,
    getTrash,
    restoreTodo,
    restoreAllTrash,
    permanentDelete,
    emptyTrash,
} from "../controller/todo.controller.js";

const router = Router();

// Apply auth protection to all todo routes
router.use(protect);

// Specific named routes FIRST before /:id parameter
router.get("/trash", getTrash);
router.patch("/restore-all", restoreAllTrash);
router.delete("/empty-trash", emptyTrash);
router.patch("/restore/:id", restoreTodo);
router.delete("/permanent/:id", permanentDelete);

// Standard collection routes
router.post(
    "/",
    createTodoValidator,
    validate,
    createTodo
);

router.get(
    "/",
    getTodos
);

// Parameterized /:id routes
router.get(
    "/:id",
    getTodoById
);

router.patch(
    "/:id",
    updateTodoValidator,
    validate,
    updateTodo
);

router.delete(
    "/:id",
    deleteTodo
);

export default router;