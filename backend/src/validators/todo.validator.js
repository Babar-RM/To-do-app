import { body } from "express-validator";

export const createTodoValidator = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 150 })
        .withMessage("Title cannot exceed 150 characters"),

    body("description")
        .optional()
        .trim(),

    body("priority")
        .optional()
        .isIn(["urgent", "high", "medium", "low"])
        .withMessage("Priority must be urgent, high, medium, or low"),

    body("category")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Category name cannot exceed 50 characters"),

    body("dueDate")
        .optional({ nullable: true }),

    body("subtasks")
        .optional()
        .isArray()
        .withMessage("Subtasks must be an array"),
];

export const updateTodoValidator = [
    body("title")
        .optional()
        .trim()
        .isLength({ min: 1, max: 150 })
        .withMessage("Title cannot exceed 150 characters"),

    body("description")
        .optional()
        .trim(),

    body("completed")
        .optional()
        .isBoolean()
        .withMessage("Completed must be a boolean"),

    body("priority")
        .optional()
        .isIn(["urgent", "high", "medium", "low"])
        .withMessage("Priority must be urgent, high, medium, or low"),

    body("category")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("Category name cannot exceed 50 characters"),

    body("dueDate")
        .optional({ nullable: true }),

    body("subtasks")
        .optional()
        .isArray()
        .withMessage("Subtasks must be an array"),
];