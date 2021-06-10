const Task = require("../model/Task");
const taskService = require("../service/TaskService");

exports.showTask = async (req, res) => {};

//PUT /task/:id
exports.update = async (req, res) => {
    try {
        const task = await taskService.update(req, res);
        return res
            .status(200)
            .json({ message: "Sửa task thành công", body: task });
    } catch (err) {
        return res.status(500).json({ message: "Server error " + err.message });
    }
};

//PUT /task/priority/:id
exports.updatePriority = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id });
        task.priority = req.body.priority;
        await task.save();
        return res
            .status(200)
            .json({ message: "Update priority thành công", body: task });
    } catch (err) {
        return res.status(500).json({ message: "Server error " + err.message });
    }
};
// PUT /task/status/:id
exports.updateStatus = async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id });
        task.status = req.body.status;
        await task.save();
        return res
            .status(200)
            .json({ message: "Update status thành công", body: task });
    } catch (err) {
        return res.status(500).json({ message: "Server error " + err.message });
    }
};

//POST /task/user
exports.addUserToTask = async (req, res) => {
    try {
        if (req.role === "admin") {
            const task = await taskService.addUserToTask(req);
            if (!task || typeof task === "undefined") {
                return res.status(401).status({
                    message: "Thêm user cho task không thành công",
                });
            }
            return res.json({
                message: "Thêm user cho task thành công",
                body: task,
            });
        } else {
            res.status(200).json({
                message: "Bạn không có quyền thêm user cho task",
            });
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error " + err.message });
    }
};

// PUT /api/task/addContent/:id
exports.addContent = async (req, res) => {
    try {
        if (req.role === "admin") {
            const taskContent = await taskService.addContent(req, res);
            if (!taskContent || typeof taskContent === "undefined") {
                res.status(401).status({
                    message: "Thêm task không thành công",
                });
            }
            res.status(200).json({
                message: "Thêm task thành công",
                body: taskContent,
            });
        } else {
            res.status(200).json({
                message: "Bạn không có quyền thêm nội dung task task ",
            });
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error " + err.message });
    }
};

// POST /api/task/:id
exports.create = async (req, res) => {
    try {
        if (req.role === "admin") {
            const task = await taskService.create(req);
            return res
                .status(200)
                .json({ message: "Thêm task thành công", body: task });
        } else {
            res.status(200).json({
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
                return res.status(401).json({
                    message: "Task không tồn tại!!",
                });
            }
            await Task.deleteOne({ _id: id });
            return res.status(200).json({ message: "Xóa task thành công!!" });
        } else {
            return res.status(200).json({
                message: "Bạn không có quyền xóa task ",
            });
        }
    } catch (err) {
        return res.status(500).json({ message: "Server error " + err.message });
    }
};
