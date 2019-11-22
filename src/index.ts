import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import morgan from "morgan";
import path from "path";
import logger from "./config/winston";
import { ConnectionManager } from "./Connections/dbConnections";
import * as router from "./RoutesList";
export const app = express();
dotenv.config();

// Connecting all required DBs from an external class
(async function dbConnect() {
    await ConnectionManager.prototype.dbConnect();
    await ConnectionManager.prototype.redisConnect();
})();

app.set("port", process.env.PORT);
app.use(cors());

// using express body-parser for form data
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "./../front", "build")));
app.disable("x-powered-by");

app.use("/user", router.UserRouter);

class MyStream {
    private write(message: string) {
        logger.info(message);
    }
}
const mystream = new MyStream();
app.use(morgan("dev"));

if (process.env.NODE_ENV !== "production") {
    logger.debug("Logging initialized at debug level");
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "./../front", "build", "index.html"));
});

export default app;

// module.exports = app; // for testing
