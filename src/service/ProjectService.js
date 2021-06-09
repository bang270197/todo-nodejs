const Project = require("../model/Project");
const User = require("../model/User");
const authService = require("../service/AuthToken");

exports.update = async (req) => {
    var file = req.file;
    let math = ["image/png", "image/jpeg"];
    if (math.indexOf(file.mimetype) === -1) {
        let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
        throw Error(errorMess);
    }
    const body = req.body;
    body.thumbnail = file.path;
    const project = await Project.findOneAndUpdate(
        {
            _id: req.params.id,
        },
        body
    );
    return project;
};

exports.addUserToProject = async (body) => {
    const { userId, projectId } = body;
    const user = await User.aggregate([
        {
            $match: { _id: userId },
        },
    ]);
    const project = await Project.findOne([
        {
            $match: { _id: projectId },
        },
    ]);
    if (!project) {
        throw Error("Not found project");
    }
    if (!user) {
        throw Error("Not found user");
    }
    project.users.push(userId);
    await project.save();
    user.projects.push(projectId);
    await user.save();
    return project;
};
exports.createService = async (req) => {
    var file = req.file;
    let math = ["image/png", "image/jpeg"];
    if (math.indexOf(file.mimetype) === -1) {
        let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
        throw Error(errorMess);
    }
    const body = req.body;
    const userName = await decodeUser(req);
    body.createBy = userName;
    body.thumbnail = file.path;
    body.status = "undone";
    const project = await Project.create(body);
    return project;
};
exports.showAll = async (req) => {
    const userName = await decodeUser(req);
    const { limit, page } = req.query;
    const projects = await Project.aggregate([
        {
            $lookup: {
                from: "tasks",
                localField: "tasks",
                foreignField: "_id",
                as: "listTask",
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "users",
                foreignField: "_id",
                as: "listUser",
            },
        },
        {
            $match: { createBy: userName },
        },
        {
            $sort: { createdAt: -1 },
        },
        {
            $project: {
                _id: 1,
                title: 1,
                detail: 1,
                createBy: 1,
                thumbnail: 1,
                status: 1,
                createdAt: 1,
                tasks: 1,
                "listUser.username": 1,
                "listUser.email": 1,
                "listUser._id": 1,
                listTask: 1,
                // users: { $arrayElemAt: ["$listUser", 0] },
            },
        },
        { $skip: (page - 1) * limit },
        { $limit: Number(limit) },
    ]);
    return projects;
};
const decodeUser = async (req) => {
    let token = req.headers["x-access-token"] || req.headers["authorization"];
    if (typeof token === "undefined" || token === null) {
        return res.status(401).json({
            message: "Không tìm thấy accessToken",
        });
    }
    if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
    }
    const verifyToken = await authService.decodeToken(
        token,
        process.env.SINGNATURE
    );
    if (verifyToken === null || typeof verifyToken === "undefined") {
        return res.status(401).json({ message: "Bạn không có quyền truy cập" });
    }
    const userName = verifyToken.user.username;
    return userName;
};
