const transMailWelCome = {
    subject: "ĐĂNG KÝ THÀNH CÔNG TÀI KHOẢN!!",
    template: (user) => {
        return `<h3>Xin chào ${user.username}.</h3>
        <h4>Chúc mừng bạn đã đăng ký thành công tài khoản</h4>
`;
    },
};
const contentTaskToUser = {
    subject: "THÔNG BÁO GÁN TASK!!",
    template: (content, priority) => {
        const status =
            priority === "high"
                ? `<p style="color: red;">${priority}</p>`
                : priority === "medium"
                ? `<p style="color: orange;">${priority}</p>`
                : priority === "low"
                ? `<p style="color: yellow;">${priority}</p>`
                : ``;
        return `<h3>Bạn đã được gán task với nội dung ${content}.</h3>
        <h3>Mức độ ưu tiên của task này là : ${status}</h3>
`;
    },
};
module.exports = {
    transMailWelCome: transMailWelCome,
    contentTaskToUser: contentTaskToUser,
};
