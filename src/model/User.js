const { Schema, model } = require("mongoose");

const user = new Schema(
    {
        username: { type: String, defauld: "" },
        password: { type: String, defauld: "" },
        email: { type: String, defauld: "" },
        refreshToken: { type: String, defauld: "" },
        role: { type: String, defauld: "" },
        projects: [
            {
                type: Schema.Types.ObjectId,
                ref: "Project",
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
const User = model("User", user);
module.exports = User;
