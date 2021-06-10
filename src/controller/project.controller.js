const User = require("../model/User");
const Project = require("../model/Project");
const Task = require("../model/Task");
const projectService = require("../service/ProjectService");
const { validationResult } = require("express-validator");

exports.count = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.countDocuments({ projects: id });
        const task = await Task.countDocuments({ project: id });
        let [count_user, count_task] = await Promise.all([
            User.countDocuments({ projects: id }),
            Task.countDocuments({ project: id }),
        ]);
        return res.json({
            message: "Số lượng task và user",
            countUser: count_user,
            countTask: count_task,
        });
    } catch (err) {
        return res.status(500).send("Server error " + err.message);
    }
};

//[PUT] api/project/status/:id
exports.updateStatus = async (req, res) => {
    try {
        if (req.role === "admin") {
            const id = req.params.id;
            const project = await Project.findOne({ _id: id });
            project.status = project.status === "done" ? "undone" : "done";
            await project.save();
            res.status(200).json({
                message: "Update status thành công!",
                body: project,
            });
        } else {
            res.status(200).json({
                message: "Bạn không có quyền update status project",
            });
        }
    } catch (err) {
        return res.status(500).send("Server error " + err.message);
    }
};

//[put] api/project/:id
exports.update = async (req, res) => {
    try {
        if (req.role === "admin") {
            const id = req.params.id;
            const project = await Project.findOne({ _id: id });
            if (!project || typeof project === "undefined") {
                return res.json({ message: "Project không tồn tại" });
            }
            const projectUpdate = await projectService.update(req);
            res.json({ message: "Update Project thành công!", projectUpdate });
        } else {
            res.status(200).json({
                message: "Bạn không có quyền sửa thông tin project",
            });
        }
    } catch (err) {
        return res.status(500).send("Server error " + err.message);
    }
};
//[DELETE] /api/project/:id
exports.delete = async (req, res) => {
    try {
        if (req.role === "admin") {
            const id = req.params.id;
            const project = await Project.findOne({ _id: id });
            if (!project) {
                return res.json({ message: "Project không tồn tại" });
            }
            await Project.deleteOne({ _id: id });
            res.json({ message: "Xóa project thành công!!" });
        } else {
            res.status(200).json({
                message: "Bạn không có quyền xóa project",
            });
        }
    } catch (err) {
        return res.status(500).send("Server error " + err.message);
    }
};
//[POST] /api/project
exports.create = async (req, res) => {
    try {
        if (req.role === "admin") {
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
        } else {
            res.status(200).json({
                message: "Bạn không có quyền thêm project",
            });
        }
    } catch (err) {
        // log.error(`Create project error: ${err.message}`);
        return res.status(500).send("Server error " + err.message);
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
        return res.status(500).send("Server error " + err.message);
    }
};
// [POST] api/project/user
exports.addUser = async (req, res) => {
    try {
        if (req.role === "admin") {
            const project = await projectService.addUserToProject(req.body);
            if (!project || typeof project === "undefined") {
                return res.status(400).json("Project không tồn tại");
            }
            res.json({
                message: "Thêm user vào project thành công!!",
                project,
            });
        } else {
            res.status(200).json({
                message: "Bạn không có quyền thêm user cho project",
            });
        }
    } catch (err) {
        // log.error(`Get list project error: ${err.message}`);
        return res.status(500).send("Server error " + err.message);
    }
};
