import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import {
    createTodo as createTodoService,
    getTodos as getTodosService,
    getTodoById as getTodoByIdService,
    updateTodo as updateTodoService,
    deleteTodo as deleteTodoService,
    getTrashTodos as getTrashTodosService,
    restoreTodo as restoreTodoService,
    restoreAllTrash as restoreAllTrashService,
    permanentDeleteTodo as permanentDeleteTodoService,
    emptyTrash as emptyTrashService,
} from "../services/todo.services.js";

const createTodo = asyncHandler(async (req, res) => {
    const { title, description, priority, category, dueDate, subtasks } = req.body;
    const todo = await createTodoService({
        title,
        description,
        priority,
        category,
        dueDate,
        subtasks,
        userId: req.user._id,
    });
    res.status(201).json(
        new ApiResponse(201, "Todo created successfully", todo)
    );
});

const getTodos = asyncHandler(async (req, res) => {
    const todos = await getTodosService(req.user._id, req.query);
    res.status(200).json(
        new ApiResponse(200, "Todos fetched successfully", todos)
    );
});

const getTodoById = asyncHandler(async (req, res) => {
    const todo = await getTodoByIdService(req.params.id, req.user._id);
    res.status(200).json(
        new ApiResponse(200, "Todo fetched successfully", todo)
    );
});

const updateTodo = asyncHandler(async (req, res) => {
    const todo = await updateTodoService(
        req.params.id,
        req.user._id,
        req.body
    );
    res.status(200).json(
        new ApiResponse(200, "Todo updated successfully", todo)
    );
});

const deleteTodo = asyncHandler(async (req, res) => {
    const todo = await deleteTodoService(req.params.id, req.user._id);
    res.status(200).json(
        new ApiResponse(200, "Todo moved to trash", todo)
    );
});

const getTrash = asyncHandler(async (req, res) => {
    const todos = await getTrashTodosService(req.user._id);
    res.status(200).json(
        new ApiResponse(200, "Trash fetched successfully", todos)
    );
});

const restoreTodo = asyncHandler(async (req, res) => {
    const todo = await restoreTodoService(req.params.id, req.user._id);
    res.status(200).json(
        new ApiResponse(200, "Todo restored successfully", todo)
    );
});

const restoreAllTrash = asyncHandler(async (req, res) => {
    await restoreAllTrashService(req.user._id);
    res.status(200).json(
        new ApiResponse(200, "All todos restored successfully")
    );
});

const permanentDelete = asyncHandler(async (req, res) => {
    await permanentDeleteTodoService(req.params.id, req.user._id);
    res.status(200).json(
        new ApiResponse(200, "Todo permanently deleted")
    );
});

const emptyTrash = asyncHandler(async (req, res) => {
    await emptyTrashService(req.user._id);
    res.status(200).json(
        new ApiResponse(200, "Trash emptied successfully")
    );
});

export {
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
};