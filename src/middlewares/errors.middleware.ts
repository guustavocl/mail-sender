import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { MongooseError } from "mongoose";
import { ZodError } from "zod";

import { config } from "../config";
import { ApiError } from "../utils/ApiError";
import logger from "../utils/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = () => (error: unknown, req: Request, res: Response, next: NextFunction) => {
  try {
    let response = {
      code: httpStatus.INTERNAL_SERVER_ERROR as number,
      message: "Something went wrong!",
      errors: {},
    };

    if (typeof error === "string") {
      response = {
        ...response,
        message: error,
      };
    } else if (error instanceof ApiError) {
      response = {
        ...response,
        code: error.statusCode,
        message: error.message,
        ...(!config.production && { errors: error.stack }),
      };
    } else if (error instanceof ZodError) {
      response = {
        code: httpStatus.BAD_REQUEST,
        message: "Invalid request",
        errors: JSON.parse(error.message),
      };
    } else if (error instanceof MongooseError) {
      response = {
        ...response,
        code: httpStatus.BAD_REQUEST,
        message: error.message,
        errors: error,
      };
    } else if (error instanceof Error) {
      response = {
        ...response,
        message: error.message,
      };
    }

    res.locals.errorMessage = response.message;
    res.status(response.code).send(response);
  } catch (error) {
    logger.error(new Error("Internal Server Error~"));
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({ message: "Internal Server Error~" });
  }
};
