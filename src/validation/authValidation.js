const { body } = require("express-validator");

let validateUpdateUser = [
    body("email", "Không đúng định dạng email").not().isEmpty().isEmail(),
    body("email", "email không được để trống").not().isEmpty(),
    body("username", "username không được để trống").not().isEmpty(),
    body("username", "username không được nhỏ hơn 6 ký tự").isLength({
        min: 6,
    }),
    body("newpassword", "password không được nhỏ hơn 6 ký tụ").isLength({
        min: 6,
    }),
    body("newpassword", "password không được để trống").not().isEmpty(),
];
let validateRegisterUser = [
    body("email", "Không đúng định dạng email").not().isEmpty().isEmail(),
    body("email", "email không được để trống").not().isEmpty(),
    body("username", "username không được để trống").not().isEmpty(),
    body("username", "username không được nhỏ hơn 6 ký tự").isLength({
        min: 6,
    }),
    body("password", "password không được nhỏ hơn 6 ký tụ").isLength({
        min: 6,
    }),
    body("password", "password không được để trống").not().isEmpty(),
];
let validateCreateProject = [
    body("title", "title không được để trống").not().isEmpty(),
    body("title", "title không được nhỏ hơn 6 ký tự").isLength({
        min: 3,
    }),
    body("detail", "detail không được để trống").not().isEmpty(),
    body("detail", "detail không được nhỏ hơn 6 ký tự").isLength({
        min: 3,
    }),
];

module.exports = {
    validateRegisterUser: validateRegisterUser,
    validateUpdateUser: validateUpdateUser,
    validateCreateProject: validateCreateProject,
};
