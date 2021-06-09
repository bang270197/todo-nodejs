const Task = require("../model/Task");
const taskService = require("../service/TaskService");

// PUT /api/task/addContent/:id
exports.addContent = async (req, res) => {
    try {
        const taskContent = await taskService.addContent(req);
        res.status(200).json({
            message: "Thêm task thành công",
            body: taskContent,
        });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

// POST /api/task/:id
exports.create = async (req, res) => {
    try {
        const task = await taskService.create(req);
        res.status(200).json({ message: "Thêm task thành công", body: task });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};
// [DELETE] /api/task/:id
exports.delete = async (req, res) => {
    try {
        const id = req.params.id;
        const task = await Task.findOne({ _id: id });
        if (!task || typeof task === "undefined") {
            res.status(401).json({
                message: "Task không tồn tại!!",
            });
        }
        await Task.deleteOne({ _id: id });
        res.status(200).json({ message: "Xóa task thành công!!" });
    } catch (err) {
        return res.status(500).send("Server error" + err.message);
    }
};
