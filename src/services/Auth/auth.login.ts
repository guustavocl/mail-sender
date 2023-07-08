import httpStatus from "http-status";
import { ApiError } from "../../utils/ApiError";
import { UserService } from "../User";

export const login = async (email: string, password: string) => {
  const user = await UserService.findByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong email or password");
  }
  return user;
};
