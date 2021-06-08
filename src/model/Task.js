const { Schema, model } = require("mongoose");

const task = new Schema(
    {
        title: { type: String, defauld: "" },
        detail: { type: String, defauld: "" },
        priority: { type: String, enum: ["high", "medium", "low"] },
        status: { type: String, enum: ["new", "progress", "done"] },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        project: {
            type: Schema.Types.ObjectId,
            ref: "Project",
        },
    },
    { timestamps: true }
);
const Task = model("Task", task);
module.exports = Task;
