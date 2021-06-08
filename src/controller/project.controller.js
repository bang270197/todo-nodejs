const User = require("../model/User");
const Project = require("../model/Project");
const projectService = require("../service/ProjectService");
const { validationResult } = require("express-validator");
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
        const projects = await projectService.showAll(req);
        if (projects === null || typeof projects === "undefined") {
            res.staus(200).json({
                message: "Danh sách project trống!!",
            });
        }
        res.status(200).json({
            message: "Danh sách project",
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
