const User = require("../model/User");
exports.show = async (req, res) => {
    try {
        const users = await User.aggregate([
            {
                $match: { role: "user" },
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    email: 1,
                    createBy: 1,
                    role: 1,
                    createdAt: 1,
                },
            },
        ]);
        if (users.length === 0 || typeof users === "undefined") {
            return res.status(200).json({
                code: "400",
                message: "Lấy danh sách user lỗi",
                body: users,
            });
        }
        return res.status(200).json({
            code: "200",
            message: "Danh sách user",
            body: users,
        });
    } catch (error) {
        return res
            .status(500)
            .json({ code: "500", message: "Server error " + err.message });
    }
};
