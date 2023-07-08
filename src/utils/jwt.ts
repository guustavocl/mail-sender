import jwt from "jsonwebtoken";
import { config } from "../config";
import { UserProps } from "../models/User/User.types";
import { Response } from "express";

export const setCookie = (user: UserProps, res: Response) => {
  const token = createToken(user);

  const expireDate = new Date();
  expireDate.setDate(expireDate.getDate() + 1);

  res.cookie(config.authCookie, token, {
    domain: config.production ? "example.com" : "127.0.0.1",
    secure: config.production ? true : false,
    expires: expireDate,
    httpOnly: true,
    sameSite: "strict",
  });
};

export const createToken = (user: UserProps) => {
  return jwt.sign({ _id: user._id }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};
