const Task = require("../model/Task");
const taskService = require("../service/TaskService");

// POST /api/task/:id
exports.create = async (req, res) => {
    try {
        const task = await taskService.create(req);
        res.status(200).json({ message: "Thêm task thành công", body: task });
    } catch (err) {
        return res.status(500).send("Server error" + err.message);
    }
};
