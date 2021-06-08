const transMailWelCome = {
    subject: "ĐĂNG KÝ THÀNH CÔNG TÀI KHOẢN!!",
    template: (user) => {
        return `<h3>Xin chào ${user.username}.</h3>
        <h4>Chúc mừng bạn đã đăng ký thành công tài khoản</h4>
`;
    },
};
module.exports = {
    transMailWelCome: transMailWelCome,
};
