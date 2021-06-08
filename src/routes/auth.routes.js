const express = require("express");
const route = express.Router();
const authController = require("../controller/auth.controller");
const authMiddleware = require("../middleware/apiAuth");
var { body } = require("express-validator");
const validate = require("../validation/authValidation");
route.post("/register", validate.validateRegisterUser, authController.register);
route.post("/login", authController.login);
route.put(
    "/update/user",
    validate.validateUpdateUser,
    authMiddleware.isAuthMiddleware,
    authController.update
);
module.exports = route;
