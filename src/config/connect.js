const mongoose = require("mongoose");
const connect = async () => {
    try {
        await mongoose.connect(
            `mongodb://${process.env.DB_HOST}:27017/${process.env.DB_USER}`,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
            }
        );
        console.log("Connect successfully!!");
    } catch (err) {
        console.log("Connect failed!");
    }
};
module.exports = { connect };
