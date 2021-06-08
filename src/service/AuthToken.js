const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const secretSingnature = process.env.SINGNATURE;
const lifeToken = process.env.TOKENLIFE;

//hashPassword
exports.hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};
exports.comparePassword = async (password, hashPassword) => {
    var match = await bcrypt.compare(password, hashPassword);
    return match;
};
//genarate Token
exports.generateToken = async (user, secretSingnature, lifeToken) => {
    const token = await jwt.sign(
        {
            user,
        },
        secretSingnature,
        {
            algorithm: "HS256",
            expiresIn: lifeToken,
        }
    );
    return token;
};
exports.decodeToken = async (token, secretKet) => {
    try {
        return await jwt.verify(token, secretKet, {
            ignoreExpiration: true,
        });
    } catch (error) {
        console.log(`Error in decode access token: ${error}`);
        return null;
    }
};
