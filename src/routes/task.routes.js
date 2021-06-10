const express = require("express");
const route = express.Router();
const authMiddleware = require("../middleware/apiAuth");
const validate = require("../validation/authValidation");
const taskController = require("../controller/task.controller");
route.post("/task/:id", taskController.create);
route.put("/task/addContent/:id", taskController.addContent);
route.delete("/task/:id", taskController.delete);
route.post("/task/:idTask/user/:idUser", taskController.addUserToTask);
route.put("/task/priority/:id", taskController.updatePriority);
route.put("/task/status/:id", taskController.updateStatus);
module.exports = route;
