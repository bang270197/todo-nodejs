// const mongoose = require("mongoose");
// const connect = async () => {
//     try {
//         await mongoose.connect(
//             `mongodb://${process.env.DB_HOST}:27017/${process.env.DB_USER}`,
//             {
//                 useNewUrlParser: true,
//                 useUnifiedTopology: true,
//                 useCreateIndex: true,
//             }
//         );
//         console.log("Connect successfully!!");
//     } catch (err) {
//         console.log("Connect failed!");
//     }
// };
// module.exports = { connect };
const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
//e4Q5WUOWu23Wheej
const uri = process.env.CONNECTION;

const connectDB = async () => {
    // const client = new mongoose(uri, {
    //     useNewUrlParser: true,
    //     useUnifiedTopology: true,
    // });
    try {
        // await client.connect();
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // await listDatabase(client);

        console.log("Connected successfully to server");
    } catch (error) {
        console.log("Connect Server Error");
    }
};

module.exports = { connectDB };
