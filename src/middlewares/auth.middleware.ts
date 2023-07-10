import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import { UserService } from "../services/User";
import { ApiError } from "../utils/ApiError";
import catchAsync from "../utils/catch";

export const authenticate = (admin = false) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers["authorization"]?.toString();

    if (!token) throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");

    try {
      const user = await UserService.findByToken(token);

      if (!user || user.isBanned) throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");

      if (admin && !user.isAdmin) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
      }

      res.locals.userPayload = user;

      next();
    } catch (err) {
      throw new ApiError(httpStatus.UNAUTHORIZED, "Unauthorized");
    }
  });
