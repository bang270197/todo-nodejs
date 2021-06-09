const express = require("express");
const route = express.Router();
const authMiddleware = require("../middleware/apiAuth");
const validate = require("../validation/authValidation");
const taskController = require("../controller/task.controller");
route.post("/task/:id", taskController.create);
module.exports = route;
