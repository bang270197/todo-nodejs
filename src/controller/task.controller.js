const Task = require("../model/Task");
const taskService = require("../service/TaskService");

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
        return res.status(500).json({ message: "Server error" + err.message });
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
        return res.status(500).json({ message: "Server error" + err.message });
    }
};

//POST /task/user
exports.addUserToTask = async (req, res) => {
    try {
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
    } catch (err) {
        return res.status(500).json({ message: "Server error" + err.message });
    }
};

// PUT /api/task/addContent/:id
exports.addContent = async (req, res) => {
    try {
        const taskContent = await taskService.addContent(req);
        if (!taskContent || typeof taskContent === "undefined") {
            res.status(401).status({ message: "Thêm task không thành công" });
        }
        res.status(200).json({
            message: "Thêm task thành công",
            body: taskContent,
        });
    } catch (err) {
        return res.status(500).json({ message: "Server error" + err.message });
    }
};

// POST /api/task/:id
exports.create = async (req, res) => {
    try {
        const task = await taskService.create(req);
        return res
            .status(200)
            .json({ message: "Thêm task thành công", body: task });
    } catch (err) {
        return res.status(500).json({ message: "Server error" + err.message });
    }
};
// [DELETE] /api/task/:id
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({ _id: id });
        if (!task || typeof task === "undefined") {
            return res.status(401).json({
                message: "Task không tồn tại!!",
            });
        }
        await Task.deleteOne({ _id: id });
        return res.status(200).json({ message: "Xóa task thành công!!" });
    } catch (err) {
        return res.status(500).send({ message: "Server error" + err.message });
    }
};
