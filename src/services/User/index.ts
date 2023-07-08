import { create } from "./user.create";
import { findOne, findAll, findByEmail } from "./user.find";

export const UserService = { create, findOne, findAll, findByEmail };
