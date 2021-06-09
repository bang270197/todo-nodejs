const express = require("express");
const route = express.Router();
const authMiddleware = require("../middleware/apiAuth");
const validate = require("../validation/authValidation");
const taskController = require("../controller/task.controller");
route.post("/task/:id", taskController.create);
route.put("/task/addContent/:id", taskController.addContent);
route.delete("/task/:id", taskController.delete);
module.exports = route;
