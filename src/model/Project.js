const { Schema, model } = require("mongoose");

const project = new Schema(
    {
        title: { type: String, defauld: "" },
        thumbnail: { type: String, defauld: "" },
        detail: { type: String, defauld: "" },
        status: {
            type: String,
            enum: ["done", "undone"],
        },
        createBy: { type: String, defauld: "" },
        users: [
            {
                type: Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        tasks: [
            {
                type: Schema.Types.ObjectId,
                ref: "Task",
            },
        ],
    },
    { timestamps: true }
);
const Project = model("Project", project);
module.exports = Project;
