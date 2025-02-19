import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";
import mainRouter from "./routes/main.router.js"; 

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { initRepo } from "./controllers/init.js";
import { addRepo } from "./controllers/add.js";
import { commitRepo } from "./controllers/commit.js";
import { pushRepo } from "./controllers/push.js";
import { pullRepo } from "./controllers/pull.js";
import { revertRepo } from "./controllers/revert.js";

dotenv.config();

yargs(hideBin(process.argv))
.command("start", "Starts a new Server", {}, startServer) 
.command("init", "Initialize a new repository", {}, initRepo) //Using yargs
.command("add <file>", "Add file to the repository", 
    (yargs) => {
        yargs.positional("file",{
            describe: "File to add to the staging area",
            type: "string",
        });
    }, 
    (argv) => {
        addRepo(argv.file);
    }
)
    .command(
        "commit <message>",
        "Commit the staged files", 
        (yargs) => {
            yargs.positional("message",{
                describe: "Commit Message",
                type: "string",
            });
        },
        (argv) => {
            commitRepo(argv.message);
        }
    )
        .command(
            "push",
            "Push Commits to S3",
            {},
            pushRepo)
        .command(
            "pull",
            "pull commits from S3", 
            {}, 
            pullRepo)
        .command(
            "Revert <commitID>",
            "Revert to a specific commit", 
            (yargs) => {
                yargs.positional("commitID",{
                    describe: "Commit ID to revert to",                        type: "string",
                });
            }, 
            revertRepo) 
.demandCommand(1, "You need atleast one Command")
.help().argv ;

function startServer(){
    const app = express();
    const port = process.env.PORT || 8000;

    app.use(bodyParser.json());
    app.use(express.json());

    const mongoURL = process.env.MONGODB_URL;

    mongoose
    .connect(mongoURL)
    .then(() => console.log("MONGODB CONNECTED..!"))
    .catch((err) => console.error("Unable to connect ", err));

    app.use(cors({origin:"*"}));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true })); 
    app.use("/", mainRouter);

    app.get("/", (req, res) => {
        res.send("Welcome..!");
    });

    let user = "test";
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.on("connection", (socket) => {
        socket.on("joinRoom", (userID) => {
            user = userID;
            console.log("=====");
            console.log(user);
            console.log("=====");
            socket.join(userID);
        });
    });
    const db = mongoose.connection;
        console.log("CRUD operationc called");

    httpServer.listen(port, () => {
        console.log(`Server is running on Port ${port}`);
    })
}   