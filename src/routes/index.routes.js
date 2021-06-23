const authRouter = require("./auth.routes");
const projectRouter = require("./project.routes");
const taskRouter = require("./task.routes");
const userRouter = require("./user.routes");
const authMiddleware = require("../middleware/apiAuth");
function route(app) {
    app.use("/api/auth", authRouter);
    app.use("/api", authMiddleware.isAuthMiddleware, projectRouter);
    app.use("/api", taskRouter);
    app.use("/api", userRouter);
}
module.exports = route;
