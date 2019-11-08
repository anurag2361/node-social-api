import * as winston from "winston";
import winstonDailyRotateFile from "winston-daily-rotate-file";

const level = process.env.NODE_ENV === "production" ? "error" : "debug";

const transportConsole = new winston.transports.Console({
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
    ),
    handleExceptions: true,
});

const transportFileDebug = new winstonDailyRotateFile({
    handleExceptions: true,
    format: winston.format.combine(
        winston.format.label({ label: "node-app-server" }),
        winston.format.timestamp(),
        winston.format.json(),
    ),
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
    filename: `./logs/${level}-%DATE%.log`,
    datePattern: "DD-MM-YYYY",
    level,
});

const logger = winston.createLogger({
    transports: [
        transportConsole,
        transportFileDebug,
    ],
    exceptionHandlers: [
        transportConsole,
        transportFileDebug,
    ],
    exitOnError: false,
    silent: process.env.NODE_ENV === "test",
});

export default logger;
