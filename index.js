// const express = require("express");
// require("dotenv").config();
// const path = require("path");
// const app = express();
// const port = process.env.PORT || 8080;
// var cors = require("cors");
// app.use(express.urlencoded({ extended: false }));
// app.use(express.json());
// const db = require("./src/config/connect");
const route = require("./src/routes/index.routes");
const session = require("./src/config/session");
// // app.use(
// //     "/static",
// //     express.static(path.resolve(__dirname, "../public/uploads"))
// // );
// db.connectDB().catch(console.log);
// session.configSession(app);
// app.get("/", (req, res) => {
//     res.send("Hello World!");
// });
// app.use(cors());
// route(app);
// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`);
// });

var express = require("express");
var mongoose = require("mongoose");
// var path = require("path");
var app = express();
// Combine API with socketIO server
var server = require("http").createServer(app);
// var io = require("socket.io")(server);
// var socketioJwt = require("socketio-jwt");

var bodyParser = require("body-parser");
var morgan = require("morgan");
// var mongoose = require("mongoose");
var config = require("config");
// var jwt = require("jsonwebtoken");
var jsend = require("jsend");
// var swaggerUi = require("swagger-ui-express");
var bearerToken = require("express-bearer-token");
var cors = require("cors");
// var YAML = require("yamljs");
// var swaggerDocument = YAML.load("./api_docs/api_doc.yaml");

// use body parser so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
route(app);
// user bearer token
app.use(
    bearerToken({
        bodyKey: "access_token",
        queryKey: "access_token",
        headerKey: "Bearer",
        reqKey: "token",
    })
);

// Using jsend middle ware
app.use(jsend.middleware);

// use morgan to log requests to the console
app.use(morgan("dev"));

// Import API router
session.configSession(app);

var port = process.env.PORT || config.get("server.port");
var dbUrlString = `mongodb://${config.get("mongodb.username")}:${config.get(
    "mongodb.password"
)}@${config.get("mongodb.host")}:${config.get("mongodb.port")}/${config.get(
    "mongodb.database"
)}`;
mongoose.connect(dbUrlString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", function () {
    console.log("MongoDB connected");
    app.listen(port, "0.0.0.0", () => {
        console.log("Server is running at port:" + port);
        // console.log("Document of apis at: localhost:5000/docs");
    });
});
