const session = require("express-session");
const configSession = (app) => {
    app.use(
        session({
            resave: true,
            saveUninitialized: true,
            secret: "Admin@1234",
            cookie: { maxAge: 6000 },
        })
    );
};
module.exports = {
    configSession: configSession,
};
