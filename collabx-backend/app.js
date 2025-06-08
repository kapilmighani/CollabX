import dotenv from 'dotenv';
dotenv.config();
import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";

import { connectToSocket } from "./src/controllers/SocketManager.js";

const app = express();
const server = createServer(app);
const io =  connectToSocket(server);


app.set("port", (process.env.PORT || 8000));

app.use(cors());
app.use(express.json({limit: "50kb"}));
app.use(express.urlencoded({ extended: true, limit: "50kb" }));

const start = async () => {

    const ConnectMongoDB = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`mongo connected db host: ${ConnectMongoDB.connection.host}`);
    server.listen(app.get("port"), () => {
        console.log("Server is running on port 8000");
    })
}

start();