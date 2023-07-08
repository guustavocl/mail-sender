import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";

const getDurationInMilliseconds = (start: [number, number]) => {
  const NS_PER_SEC = 1e9;
  const NS_TO_MS = 1e6;
  const diff = process.hrtime(start);

  return (diff[0] * NS_PER_SEC + diff[1]) / NS_TO_MS / 1000;
};

export const requestLogger = () => (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();
  /* RESPONSE LOGGER */
  res.on("finish", () => {
    logger.info(
      `# [${req.method.padEnd(4, " ")} RES ${res.statusCode}] IP: [${
        req.socket.remoteAddress
      }] - Duration: [${getDurationInMilliseconds(start).toFixed(6)}s] PATH: [${req.originalUrl}] USER: [${
        res.locals?.userPayload?._id || "none"
      }]`
    );
  });

  next();
};
