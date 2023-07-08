import winston from "winston";
import { config } from "../config";

const enumerateErrorFormat = winston.format(info => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  level: config.production ? "info" : "debug",
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.production ? winston.format.uncolorize() : winston.format.colorize(),
    winston.format.splat(),
    winston.format.timestamp({ format: "DD/MM/YYYY HH:mm:ss" }),
    winston.format.printf(
      info =>
        `> ${info.timestamp} [${info.level}]: ${info.message}` + (info.splat !== undefined ? `${info.splat}` : " ")
    )
  ),
  transports: config.production
    ? [
        new winston.transports.Console({
          stderrLevels: ["info", "error"],
        }),
        new winston.transports.File({
          filename: "./logs/error.log",
          level: "error",
          maxsize: 10 * 1000 * 1000, // 10 Mb
          maxFiles: 10,
          tailable: true,
        }),
        new winston.transports.File({
          filename: "./logs/info.log",
          level: "info",
          maxsize: 10 * 1000 * 1000, // 10 Mb
          maxFiles: 10,
          tailable: true,
        }),
      ]
    : [
        new winston.transports.Console({
          stderrLevels: ["info", "error", "debug"],
        }),
      ],
});

export default logger;
