var multer = require("multer");
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    },
});
//upload single file
var upload = multer({ storage: storage });
var b = "222";
module.exports = { upload: upload };
