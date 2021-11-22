const mongoose = require("mongoose");
const express = require("express");
require("dotenv").config();
//e4Q5WUOWu23Wheej
const uri = process.env.CONNECTION;

const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        ("abc");
        // await listDatabase(client);

        console.log("Connected successfully to server");
    } catch (error) {
        console.log("Connect Server Error");
    }
};

module.exports = { connectDB };
