const User = require("../model/User");
const Project = require("../model/Project");
const Task = require("../model/Task");
const projectService = require("../service/ProjectService");
const { validationResult } = require("express-validator");
const authService = require("../service/AuthToken");
exports.getUserByProject = async (req, res) => {
    const id = req.params.id;
    const projects = Project.findOne({ _id: id })
        .populate({ path: "users", select: "username" })
        .then((project) => {
            res.json({
                code: "200",
                message: "Danh sách projects",
                body: project,
            });
        })
        .catch((err) => {
            res.status(500).json({
                code: "500",
                message: "Server error " + err.message,
            });
        });
};
exports.count = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.countDocuments({ projects: id });
        const task = await Task.countDocuments({ project: id });
        let [count_user, count_task] = await Promise.all([
            User.countDocuments({ projects: id }),
            Task.countDocuments({ project: id }),
        ]);
        return res.status(200).json({
            code: "200",
            message: "Số lượng task và user",
            countUser: count_user,
            countTask: count_task,
        });
    } catch (err) {
        return res
            .status(500)
            .json({ code: "500", message: "Server error " + err.message });
    }
};

//[PUT] api/project/status/:id
exports.updateStatus = async (req, res) => {
    try {
        // if (req.role === "admin") {
        const id = req.params.id;
        const project = await Project.findOne({ _id: id });
        project.status = project.status === "done" ? "undone" : "done";
        await project.save();
        res.status(200).json({
            code: "200",
            message: "Update status thành công!",
            body: project,
        });
        // } else {
        //     res.status(200).json({
        //         code: "400",
        //         message: "Bạn không có quyền update status project",
        //     });
        // }
    } catch (err) {
        return res
            .status(500)
            .json({ code: "500", message: "Server error " + err.message });
    }
};

//[put] api/project/:id
exports.update = async (req, res) => {
    try {
        if (req.role === "admin") {
            const id = req.params.id;
            const project = await Project.findOne({ _id: id });
            if (project.length === 0 || typeof project === "undefined") {
                return res
                    .status(200)
                    .json({ message: "Project không tồn tại" });
            }
            const projectUpdate = await projectService.update(req);
            res.status(200).json({
                code: "200",
                message: "Update Project thành công!",
                projectUpdate,
            });
        } else {
            res.status(200).json({
                code: "400",
                message: "Bạn không có quyền sửa project",
            });
        }
    } catch (err) {
        return res.status(500).json("Server error " + err.message);
    }
};
//[DELETE] /api/project/:id
exports.delete = async (req, res) => {
    try {
        if (req.role === "admin") {
            const id = req.params.id;
            const project = await Project.findOne({ _id: id });
            await Task.deleteMany({ project: id });
            if (project.length === 0 || typeof project === "undefined") {
                return res
                    .status(200)
                    .json({ code: "400", message: "Project không tồn tại" });
            }
            await Project.deleteOne({ _id: id });
            res.status(200).json({
                code: "200",
                message: "Xóa project thành công!!",
                body: project,
            });
        } else {
            res.status(200).json({
                code: "400",
                message: "Bạn không có quyền xóa project",
            });
        }
    } catch (err) {
        return res
            .status(500)
            .json({ code: "500", message: "Server error " + err.message });
    }
};
//[POST] /api/project
exports.create = async (req, res) => {
    try {
        if (req.role === "admin") {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                res.status(200).json({ errors: errors.array() });
                return;
            }
            const project = await projectService.createService(req);
            if (project.length === 0 || typeof project === "undefined") {
                res.status(200).json({
                    code: "400",
                    message: "Thêm project không thành công",
                });
            }
            res.status(200).json({
                code: "200",
                message: "Thêm project thành công",
                project: project,
            });
        } else {
            res.status(200).json({
                code: "400",
                message: "Bạn không có quyền thêm project",
            });
        }
    } catch (err) {
        // log.error(`Create project error: ${err.message}`);
        return res.status(500).json("Server error " + err.message);
    }
};
// [GET] api/project
exports.show = async (req, res) => {
    try {
        const userName = await decodeUser(req);
        // console.log(userName);
        const { limit, page } = req.query;
        let [total_record, projects] = await Promise.all([
            Project.countDocuments({}),
            projectService.showAll(req),
        ]);
        const pagination = {
            page: Number(page),
            limit: Number(limit),
            totalRows: Number(total_record),
        };
        if (projects.length === 0 || typeof projects === "undefined") {
            return res.status(200).json({
                code: "400",
                message: "Danh sách project trống!!",
                projects: projects,
                pagination: pagination,
            });
        }
        return res.status(200).json({
            code: "200",
            message: "Danh sách project",
            countProject: total_record,
            projects: projects,
            pagination: pagination,
        });
    } catch (err) {
        // log.error(`Get list project error: ${err.message}`);
        return res.status(500).json({ code: "200", message: err.message });
    }
};
// [POST] api/project/user
exports.addUser = async (req, res) => {
    try {
        if (req.role === "admin") {
            const idProject = req.params.idProject;
            const idUser = req.params.idUser;
            const user = await User.findOne({ _id: idUser });
            const project = await Project.findOne({ _id: idProject });
            if (project.length === 0 || typeof project === "undefined") {
                throw Error("Not found project");
            }
            if (user === 0 || typeof user === "undefined") {
                throw Error("Not found user");
            }
            if (!project.users.includes(idUser)) {
                project.users.push(idUser);
                await project.save();
            } else {
                return res.status(200).json({
                    code: "400",
                    message: "Đã tồn tại user trong project này!!",
                });
            }
            if (!user.projects.includes(idProject)) {
                user.projects.push(idProject);
                await user.save();
            } else {
                return res.status(200).json({
                    code: "400",
                    message: "Đã tồn tại user trong project này!!",
                });
            }
            return res.status(200).json({
                code: "200",
                message: "Thêm user vào project thành công!!",
                project,
            });
        } else {
            res.status(200).json({
                code: "400",
                message: "Bạn không có quyền thêm user",
            });
        }
    } catch (err) {
        return res.status(500).json({ code: "500", message: err.message });
    }
};
const decodeUser = async (req) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (typeof token === "undefined" || token === null) {
        return res.status(401).json({
            message: "Không tìm thấy accessToken",
        });
    }
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }
    const verifyToken = await authService.decodeToken(
        token,
        process.env.SINGNATURE
    );
    if (verifyToken === null || typeof verifyToken === "undefined") {
        return res.status(401).json({ message: "Bạn không có quyền truy cập" });
    }
    const userName = verifyToken.user.username;
    return userName;
};
