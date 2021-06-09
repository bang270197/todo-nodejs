const express = require("express");
const route = express.Router();
const projectController = require("../controller/project.controller");
const authMiddleware = require("../middleware/apiAuth");
const validate = require("../validation/authValidation");
const configImage = require("../config/configImage");

route.post(
    "/project",
    configImage.upload.single("thumbnail"),
    validate.validateCreateProject,
    projectController.create
);
route.get("/project", projectController.show);
route.delete("/project/:id", projectController.delete);
route.post("/project/user", projectController.addUser);
route.put(
    "/project/:id",
    configImage.upload.single("thumbnail"),
    projectController.update
);
module.exports = route;
