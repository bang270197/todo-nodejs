const User = require("../model/User");
const authMethod = require("../service/AuthToken");
const mailer = require("../service/SendEmail");
const randToken = require("rand-token");
const { transMailWelCome } = require("../utils/ContacEmail");
const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
//POST /api/register
exports.register = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(200).json({ code: "400", errors: errors.array() });
            return;
        }
        const checkUser = await User.findOne({ username: username });
        if (checkUser) {
            res.status(200).json({
                code: "400",
                message: "Tên tài khoản đã tồn tại!!",
            });
            1;
        } else {
            const newPassword = authMethod.hashPassword(password);
            const body = {
                username: username,
                password: newPassword,
                email: email,
                role: "user",
            };
            const user = await User.create(body);
            if (user) {
                await mailer.sendEmailNormal(
                    user.email,
                    transMailWelCome.subject,
                    transMailWelCome.template(user)
                );
                res.status(200).json({
                    code: "200",
                    message: "Đăng ký thành công",
                    body: body,
                });
            } else {
                res.status(200).json({
                    code: "400",
                    message: "Đăng ký thất bại",
                });
            }
        }
    } catch (err) {
        return res
            .status(500)
            .send({ code: "500", message: "Server error" + err.message });
    }
};
//POST /api/login
exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(200).json({
                code: "400",
                message: "Tên đăng nhập không đúng!!",
            });
        }
        var checkPassword = await authMethod.comparePassword(
            password,
            user.password
        );
        if (!checkPassword) {
            return res.status(200).json({
                code: "400",
                message: "Mật khẩu không chính xác!!",
            });
        }
        const accessTokenLife = process.env.TOKENLIFE;
        const accessTokenSecret = process.env.SINGNATURE;
        const data = {
            id: user._id,
            username: username,
            role: user.role,
            password: user.password,
        };
        const accessToken = await authMethod.generateToken(
            data,
            accessTokenSecret,
            accessTokenLife
        );
        if (!accessToken) {
            return res.status(200).json({
                code: "400",
                message: "Đăng nhập không thành công!!, vui lòng thử lại",
            });
        }
        var refreshToken = randToken.generate(process.env.refreshTokenSize);
        if (!user.refreshToken) {
            const updateUser = await User.updateOne(
                { username },
                {
                    $set: {
                        refreshToken: refreshToken,
                    },
                }
            );
        } else {
            refreshToken = user.refreshToken;
        }
        return res.status(200).json({
            code: "200",
            message: "Đăng nhập thành công!!",
            accessToken: accessToken,
            refreshToken,
            username: user.username,
            role: user.role,
        });
    } catch (e) {
        return res.status(500).json({
            code: "500",
            message: "Server error" + e.message,
        });
    }
};
// POST api//update/user
exports.update = async (req, res) => {
    try {
        const { username, newpassword, email } = req.body;
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     res.status(200).json({ errors: errors.array() });
        //     return;
        // }
        const user = await User.findOne({ username: username });
        if (user.length === 0 || typeof user === "undefined") {
            return res.status(200).json({
                code: "400",
                message: "User không tồn tại!!",
            });
        }
        const password = await authMethod.hashPassword(newpassword);
        const update = await User.updateOne({
            password: password,
            email: email,
        });
        return res
            .status(200)
            .json({ code: "200", message: "Thay đổi mật thành công" });
    } catch (error) {
        return res.status(500).json({
            message: "Server error" + error.message,
        });
    }
};
