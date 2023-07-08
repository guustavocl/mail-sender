import { AuthValidations } from "../models/Auth/Auth.validations";
import { AuthService } from "../services/Auth";
import { UserService } from "../services/User";
import catchAsync from "../utils/catch";
import { setCookie } from "../utils/jwt";
import { validate } from "../utils/validate";

const login = catchAsync(async (req, res) => {
  const { body } = await validate(AuthValidations.login, req);
  const user = await AuthService.login(body.email, body.password);
  setCookie(user, res);
  res.send({ user });
});

const logout = catchAsync(async (req, res) => {
  const user = await UserService.create(req.body);
  res.send({ message: "User successfully createad", email: user?.email });
});

export const AuthController = {
  login,
  logout,
};
