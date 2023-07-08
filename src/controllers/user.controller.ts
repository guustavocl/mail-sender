import httpStatus from "http-status";
import { UserValidations } from "../models/User/User.validations";
import { UserService } from "../services/User";
import { ApiError } from "../utils/ApiError";
import catchAsync from "../utils/catch";
import { pick } from "../utils/pick";
import { validate } from "../utils/validate";

const create = catchAsync(async (req, res) => {
  const { body } = await validate(UserValidations.create, req);
  const user = await UserService.create(body);
  res.send({ message: "User successfully createad", email: user?.email });
});

const getOne = catchAsync(async (req, res) => {
  const user = await UserService.findOne(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

const getAll = catchAsync(async (req, res) => {
  const { query } = await validate(UserValidations.findAll, req);
  const filter = pick(query, ["name"]);
  const options = pick(query, ["sortBy", "limit", "page"]);

  const users = await UserService.findAll(filter, options);
  res.send(users);
});

export const UserController = {
  create,
  getOne,
  getAll,
};
