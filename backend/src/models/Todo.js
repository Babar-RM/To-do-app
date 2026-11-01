import mongoose from "mongoose";

const subtaskSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        text: { type: String, required: true, trim: true },
        completed: { type: Boolean, default: false },
    },
    { _id: false }
);

const todoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            maxLength: [150, "Title cannot exceed 150 characters"],
            trim: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
        priority: {
            type: String,
            enum: ["urgent", "high", "medium", "low"],
            default: "medium",
        },
        category: {
            type: String,
            default: "Personal",
            trim: true,
        },
        dueDate: {
            type: Date,
            default: null,
        },
        subtasks: {
            type: [subtaskSchema],
            default: [],
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for faster queries
todoSchema.index({ user: 1, isDeleted: 1, createdAt: -1 });

const Todo = mongoose.model("Todo", todoSchema);
export default Todo;