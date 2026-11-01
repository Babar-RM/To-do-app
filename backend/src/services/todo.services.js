import Todo from "../models/Todo.js";
import ApiError from "../utils/ApiError.js";

const createTodo = async ({ title, description, priority, category, dueDate, subtasks, userId }) => {
    const todo = await Todo.create({
        title,
        description: description || "",
        priority: priority || "medium",
        category: category || "Personal",
        dueDate: dueDate || null,
        subtasks: Array.isArray(subtasks) ? subtasks : [],
        user: userId,
    });
    return todo;
};

const getTodos = async (userId, query = {}) => {
    const filter = {
        user: userId,
        isDeleted: false,
    };

    if (query.category && query.category !== "all") {
        filter.category = query.category;
    }

    if (query.priority && query.priority !== "all") {
        filter.priority = query.priority;
    }

    if (query.status === "completed") {
        filter.completed = true;
    } else if (query.status === "active") {
        filter.completed = false;
    }

    if (query.search && query.search.trim()) {
        const regex = new RegExp(query.search.trim(), "i");
        filter.$or = [{ title: regex }, { description: regex }];
    }

    let sortOptions = { createdAt: -1 };
    if (query.sort === "dueDate") {
        sortOptions = { dueDate: 1, createdAt: -1 };
    } else if (query.sort === "priority") {
        sortOptions = { priority: 1, createdAt: -1 };
    } else if (query.sort === "title") {
        sortOptions = { title: 1 };
    } else if (query.sort === "oldest") {
        sortOptions = { createdAt: 1 };
    }

    return await Todo.find(filter).sort(sortOptions);
};

const getTodoById = async (todoId, userId) => {
    const todo = await Todo.findOne({
        _id: todoId,
        user: userId,
        isDeleted: false,
    });
    if (!todo) {
        throw new ApiError(404, "Todo not found");
    }
    return todo;
};

const updateTodo = async (todoId, userId, data) => {
    const todo = await Todo.findOne({
        _id: todoId,
        user: userId,
        isDeleted: false,
    });
    if (!todo) {
        throw new ApiError(404, "Todo not found");
    }

    if (data.title !== undefined) todo.title = data.title;
    if (data.description !== undefined) todo.description = data.description;
    if (data.completed !== undefined) todo.completed = data.completed;
    if (data.priority !== undefined) todo.priority = data.priority;
    if (data.category !== undefined) todo.category = data.category;
    if (data.dueDate !== undefined) todo.dueDate = data.dueDate;
    if (data.subtasks !== undefined) todo.subtasks = data.subtasks;

    await todo.save();
    return todo;
};

const deleteTodo = async (todoId, userId) => {
    const todo = await Todo.findOne({
        _id: todoId,
        user: userId,
        isDeleted: false,
    });
    if (!todo) {
        throw new ApiError(404, "Todo not found");
    }
    todo.isDeleted = true;
    todo.deletedAt = new Date();
    await todo.save();
    return todo;
};

const getTrashTodos = async (userId) => {
    return await Todo.find({
        user: userId,
        isDeleted: true,
    }).sort({ deletedAt: -1 });
};

const restoreTodo = async (todoId, userId) => {
    const todo = await Todo.findOne({
        _id: todoId,
        user: userId,
        isDeleted: true,
    });
    if (!todo) {
        throw new ApiError(404, "Todo not found in trash");
    }
    todo.isDeleted = false;
    todo.deletedAt = null;
    await todo.save();
    return todo;
};

const restoreAllTrash = async (userId) => {
    const result = await Todo.updateMany(
        { user: userId, isDeleted: true },
        { $set: { isDeleted: false, deletedAt: null } }
    );
    return result;
};

const permanentDeleteTodo = async (todoId, userId) => {
    const result = await Todo.findOneAndDelete({
        _id: todoId,
        user: userId,
        isDeleted: true,
    });
    if (!result) {
        throw new ApiError(404, "Todo not found in trash");
    }
    return result;
};

const emptyTrash = async (userId) => {
    const result = await Todo.deleteMany({
        user: userId,
        isDeleted: true,
    });
    return result;
};

export {
    createTodo,
    getTodos,
    getTodoById,
    updateTodo,
    deleteTodo,
    getTrashTodos,
    restoreTodo,
    restoreAllTrash,
    permanentDeleteTodo,
    emptyTrash,
};