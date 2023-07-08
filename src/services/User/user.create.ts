import { User } from "../../models/User/User.model";
import { UserProps } from "../../models/User/User.types";

export const create = async (userBody: UserProps) => {
  return await User.create(userBody);
};
