const express = require("express");
require("dotenv").config();
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;
var cors = require("cors");
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const db = require("./src/config/connect");
const route = require("./src/routes/index.routes");
const session = require("./src/config/session");
// app.use(
//     "/static",
//     express.static(path.resolve(__dirname, "../public/uploads"))
// );
db.connectDB().catch(console.log);
session.configSession(app);
app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use(cors());
route(app);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
