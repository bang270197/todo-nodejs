const nodeMailer = require("nodemailer");
require("dotenv").config();
var config = require("config");
const userName = config.get("mailler.default.auth.username");
const port = '25';
const host = "email-smtp.us-east-1.amazonaws.com";
const pass = config.get("mailler.default.auth.username");
const transporter = nodeMailer.createTransport({
    host: host,
    port: port,
    secure: false,
    auth: {
        user: userName,
        pass: pass,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

const sendEmailNormal = (to, subject, htmlContent) => {
    let options = {
        from: userName,
        to: to,
        subject: subject,
        html: htmlContent,
    };
    return transporter.sendMail(options);
};

module.exports = {
    sendEmailNormal: sendEmailNormal,
};
