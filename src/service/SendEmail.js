const nodeMailer = require("nodemailer");
require("dotenv").config();
const userName = process.env.MAIL_USERNAME;
const port = process.env.MAIL_PORT;
const host = process.env.MAIL_HOST;
const pass = process.env.MAIL_PASSWORD;
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
