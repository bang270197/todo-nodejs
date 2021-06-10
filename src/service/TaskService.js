const Task = require("../model/Task");
const Project = require("../model/Project");
const User = require("../model/User");
exports.update = async (req, res) => {
    const body = req.body;
    const id = req.params.id;
    const idUser = req.user._id;
    const task = await Task.findOne({ user: idUser, _id: id });
    if (task === null || typeof task === "undefined") {
        throw new Error("Bạn không có quyền thay đổi task");
    }
    task.title = body.title;
    task.detail = body.detail;
    await task.save();
    return task;
    // console.log(task.user + "---");
};
exports.addUserToTask = async (req) => {
    const userId = req.params.idUser;
    const taskid = req.params.idTask;
    const task = await Task.findOne({ _id: taskid });
    const user = await User.findOne({ _id: userId });
    if (!task || typeof task === "undefined")
        throw new Error("Task không tồn tại");
    if (!user || typeof user === "undefined") throw new Error("không tồn tại");
    task.user = userId;
    await task.save();
    if (!user.tasks.includes(taskid)) {
        user.tasks.push(taskid);
        await user.save();
    }
    return task;
};
exports.create = async (req) => {
    const body = {
        title: "",
        detail: "",
        priority: req.body.priority,
        status: req.body.status,
    };
    const id = req.params.id;
    const project = await Project.findOne({ _id: id });
    if (!project || typeof project === "undefined") {
        throw new Error("Not found project");
    }
    body.project = id;
    const task = await Task.create(body);
    project.tasks.push(task._id);
    await project.save();
    return task;
};
exports.addContent = async (req) => {
    const body = req.body;
    const id = req.params.id;
    const task = await Task.findOne({ _id: id });
    if (!task || typeof task === "undefined") {
        throw new Error("Not found task");
    }
    task.title = body.title;
    task.detail = body.detail;
    await task.save();
    return task;
};
