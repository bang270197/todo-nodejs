const User = require("../model/User");
const Project = require("../model/Project");
const projectService = require("../service/ProjectService");
const { validationResult } = require("express-validator");

//[put] api/project/status/:id
exports.updateStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const project = await Project.findOne({ _id: id });
        project.status = project.status === "done" ? "undone" : "done";
        await project.save();
        res.status(200).json({
            message: "Update status thành công!",
            body: project,
        });
    } catch (err) {
        return res.status(500).send("Server error" + err.message);
    }
};

//[put] api/project/:id
exports.update = async (req, res) => {
    const id = req.params.id;
    const project = await Project.findOne({ _id: id });
    if (!project || typeof project === "undefined") {
        return res.json({ message: "Project không tồn tại" });
    }
    const projectUpdate = await projectService.update(req);
    res.json({ message: "Update Project thành công!", projectUpdate });
};
//[DELETE] /api/project/:id
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const project = await Project.findOne({ _id: id });
        if (!project) {
            return res.json({ message: "Project không tồn tại" });
        }
        await Project.deleteOne({ _id: id });
        res.json({ message: "Xóa project thành công!!" });
    } catch (err) {
        return res.status(500).send("Server error" + err.message);
    }
};
//[POST] /api/project
exports.create = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }
        const project = await projectService.createService(req);
        if (project === null) {
            res.status(400).json({
                message: "Thêm project không thành công",
            });
        }
        res.status(200).json({
            message: "Thêm project thành công",
            project: project,
        });
    } catch (err) {
        // log.error(`Create project error: ${err.message}`);
        return res.status(500).send("Server error" + err.message);
    }
};
// [GET] api/project
exports.show = async (req, res) => {
    try {
        let [total_record, projects] = await Promise.all([
            Project.countDocuments({}),
            projectService.showAll(req),
        ]);
        if (projects === null || typeof projects === "undefined") {
            res.staus(200).json({
                message: "Danh sách project trống!!",
            });
        }
        res.status(200).json({
            message: "Danh sách project",
            countProject: total_record,
            projects: projects,
        });
    } catch (err) {
        // log.error(`Get list project error: ${err.message}`);
        return res.status(500).send("Server error" + err.message);
    }
};
// [POST] api/project/user
exports.addUser = async (req, res) => {
    try {
        const project = await projectService.addUserToProject(req.body);
        if (!project || typeof project === "undefined") {
            return res.status(400).json("Project không tồn tại");
        }
        res.json({
            message: "Thêm user vào project thành công!!",
            project,
        });
    } catch (err) {
        // log.error(`Get list project error: ${err.message}`);
        return res.status(500).send("Server error" + err.message);
    }
};
