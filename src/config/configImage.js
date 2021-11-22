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
<<<<<<< HEAD
var a = "123";
=======
var b = "222";
>>>>>>> master
module.exports = { upload: upload };
