import { FilterQuery, PaginateOptions } from "mongoose";
import { User } from "../../models/User/User.model";
import { UserProps } from "../../models/User/User.types";

export const findOne = async (userId: string) => {
  return await User.findOne({ _id: userId });
};

export const findAll = async (filter: FilterQuery<UserProps>, options: PaginateOptions) => {
  const users = await User.paginate(filter, options);
  return users;
};

export const findByEmail = async (email: string) => {
  return await User.findOne({ email: email });
};
