const Task = require("../model/Task");
const taskService = require("../service/TaskService");

exports.show = async (req, res) => {
    try {
        const id = req.params.id;
        const tasks = await Task.find({ project: { $in: [id] } });
        if (tasks === null || typeof tasks === "undefined") {
            return res.status(200).json({
                code: "400",
                message: "Lấy danh sách task lỗi",
            });
        }
        return res.status(200).json({
            code: "200",
            message: "Danh sách task",
            body: tasks,
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error " + err.message });
    }
};

exports.countStatus = async (req, res) => {
    try {
        const body = req.body;
        const id = req.params.id;
        const count = await Task.countDocuments({
            project: id,
            status: body.status,
        });
        return res.json({
            code: "200",
            message: "Count số lượng task",
            body: count,
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error " + err.message });
    }
};

//PUT /task/:id
exports.update = async (req, res) => {
    try {
        const task = await taskService.update(req, res);
        return res
            .status(200)
            .json({ code: "200", message: "Sửa task thành công", body: task });
    } catch (err) {
        return res
            .status(500)
            .json({ code: "500", message: "Server error " + err.message });
    }
};

//PUT /task/priority/:id
exports.updatePriority = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id });
        task.priority = req.body.priority;
        await task.save();
        return res.status(200).json({
            code: "200",
            message: "Update priority thành công",
            body: task,
        });
    } catch (err) {
        return res
            .status(500)
            .json({ code: "500", message: "Server error " + err.message });
    }
};
// PUT /task/status/:id
exports.updateStatus = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id });
        task.status = req.body.status;
        await task.save();
        return res.status(200).json({
            code: "200",
            message: "Update status thành công",
            body: task,
        });
    } catch (err) {
        return res
            .status(500)
            .json({ code: "500", message: "Server error " + err.message });
    }
};

//POST /task/user
exports.addUserToTask = async (req, res) => {
    try {
        if (req.role === "admin") {
            const task = await taskService.addUserToTask(req);
            if (!task || typeof task === "undefined") {
                return res.status(401).status({
                    code: "400",
                    message: "Thêm user cho task không thành công",
                });
            }
            return res.json({
                code: "200",
                message: "Thêm user cho task thành công",
                body: task,
            });
        } else {
            res.status(200).json({
                code: "400",
                message: "Bạn không có quyền thêm user cho task",
            });
        }
    } catch (err) {
        return res
            .status(500)
            .json({ code: "500", message: "Server error " + err.message });
    }
};

// PUT /api/task/addContent/:id
// exports.addContent = async (req, res) => {
//     try {
//         if (req.role === "admin") {
//             const taskContent = await taskService.addContent(req, res);
//             if (!taskContent || typeof taskContent === "undefined") {
//                 res.status(200).status({
//                     code: "400",
//                     message: "Thêm task không thành công",
//                 });
//             }
//             res.status(200).json({
//                 code: "200",
//                 message: "Thêm task thành công",
//                 body: taskContent,
//             });
//         } else {
//             res.status(200).json({
//                 code: "400",
//                 message: "Bạn không có quyền thêm nội dung task task ",
//             });
//         }
//     } catch (err) {
//         return res.status(500).json({ message: "Server error " + err.message });
//     }
// };

// POST /api/task/:id
exports.create = async (req, res) => {
    try {
        if (req.role === "admin") {
            const task = await taskService.create(req);
            return res.status(200).json({
                code: "200",
                message: "Thêm task thành công",
                body: task,
            });
        } else {
            res.status(200).json({
                code: "400",
                message: "Bạn không có quyền thêm task ",
            });
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error " + err.message });
    }
};
// [DELETE] /api/task/:id
exports.delete = async (req, res) => {
    try {
        if (req.role === "admin") {
            const id = req.params.id;
            const task = await Task.findOne({ _id: id });
            if (!task || typeof task === "undefined") {
                return res.status(200).json({
                    code: "400",
                    message: "Task không tồn tại!!",
                });
            }
            await Task.deleteOne({ _id: id });
            return res
                .status(200)
                .json({ code: "200", message: "Xóa task thành công!!" });
        } else {
            return res.status(200).json({
                code: "400",
                message: "Bạn không có quyền xóa task ",
            });
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error " + err.message });
    }
};
