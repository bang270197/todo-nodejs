const authRouter = require("./auth.routes");
const projectRouter = require("./project.routes");
const taskRouter = require("./task.routes");
const authMiddleware = require("../middleware/apiAuth");
function route(app) {
    app.use("/api/auth", authRouter);
    app.use("/api", authMiddleware.isAuthMiddleware, projectRouter);
    app.use("/api", taskRouter);
    app.get("/v1", function (req, res) {
        res.json({ message: "ok" });
    });
}
module.exports = route;
