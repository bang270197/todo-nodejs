const Project = require("../model/Project");
const User = require("../model/User");
const authService = require("../service/AuthToken");

exports.update = async (req) => {
    var file = req.file;
    const project = await Project.findOne({ _id: req.params.id });
    if (typeof file !== "undefined") {
        let math = ["image/png", "image/jpeg"];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            throw Error(errorMess);
        }
        project.thumbnail = file.path;
    }
    const body = req.body;
    project.title = body.title;
    project.detail = body.detail;

    await project.save();
    return project;
};

exports.addUserToProject = async (req, res) => {
    const idProject = req.params.idProject;
    const idUser = req.params.idUser;
    const user = await User.findOne({ _id: idUser });
    const project = await Project.findOne({ _id: idProject });
    const data = {
        body,
    };
    if (project.length === 0 || typeof project === "undefined") {
        throw Error("Not found project");
    }
    if (user.length === 0 || typeof user === "undefined") {
        throw Error("Not found user");
    }
    if (!project.users.includes(idUser)) {
        project.users.push(idUser);
        await project.save();
    } else {
        return res.status(200).json({
            code: "400",
            message: "Đã tồn tại user trong project này!!",
        });
    }
    if (!user.projects.includes(idProject)) {
        user.projects.push(idProject);
        await user.save();
    }
    return project;
};
exports.createService = async (req) => {
    var file = req.file;
    const body = req.body;
    if (typeof file !== "undefined") {
        let math = ["image/png", "image/jpeg"];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
            throw Error(errorMess);
        }
        body.thumbnail = file.path;
    }

    const { username } = await decodeUser(req);
    body.createBy = username;
    body.status = "undone";
    const project = await Project.create(body);
    return project;
};
exports.showAll = async (req) => {
    const { id } = await decodeUser(req);

    // const users = await User.find({ _id: userNameId });
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
        // {
        //     $unwind: "$listUser",
        // },
        // {
        //     $match: { "listUser._id": { $in: ["60dab7e66fc0555004635cce"] } },
        // },
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
    // const { id, usename } = verifyToken.user.id;
    return verifyToken.user;
};
