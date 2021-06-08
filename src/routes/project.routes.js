const express = require("express");
const route = express.Router();
const projectController = require("../controller/project.controller");
const authMiddleware = require("../middleware/apiAuth");
const validate = require("../validation/authValidation");
const configImage = require("../config/configImage");

route.post(
    "/project",
    configImage.upload.single("thumbnail"),
    authMiddleware.isAuthMiddleware,
    validate.validateCreateProject,
    projectController.create
);
route.get("/project", authMiddleware.isAuthMiddleware, projectController.show);
route.delete(
    "/project/:id",
    authMiddleware.isAuthMiddleware,
    projectController.delete
);
route.post(
    "/project/user",
    authMiddleware.isAuthMiddleware,
    projectController.addUser
);

module.exports = route;
