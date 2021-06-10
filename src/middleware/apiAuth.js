const authMethod = require("../service/AuthToken");
const User = require("../model/User");
exports.isAuthMiddleware = async (req, res, next) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (typeof token === "undefined" || token === null) {
        return res.status(401).json({
            message: "Không tìm thấy accessToken",
        });
    }
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }
    const verifyToken = await authMethod.decodeToken(
        token,
        process.env.SINGNATURE
    );
    if (!verifyToken) {
        return res.status(401).json({ message: "Bạn không có quyền truy cập" });
    }
    const userName = verifyToken.user.username;
    const role = verifyToken.user.role;
    const user = await User.findOne({ username: userName });
    req.user = user;
    req.role = role;
    return next();
};
