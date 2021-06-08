const authRouter = require("./auth.routes");
const projectRouter = require("./project.routes");
function route(app) {
    app.use("/api/auth", authRouter);
    app.use("/api", projectRouter);
}
module.exports = route;
