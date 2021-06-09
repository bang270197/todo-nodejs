const Task = require("../model/Task");
const Project = require("../model/Project");
exports.create = async (req) => {
    const body = req.body;
    const id = req.params.id;
    const project = await Project.findOne({ _id: id });
    if (!project || typeof project === "undefined") {
        throw new Error("Not found project");
    }
    body.project = id;
    const task = await Task.create(body);
    console.log(task._id);
    project.tasks.push(task._id);
    await project.save();
    return task;
};
