import { create } from "./user.create";
import { findAll, findByEmail, findByToken, findOne } from "./user.find";
import { quotaReached, updateQuota } from "./user.quota";

export const UserService = { create, findOne, findAll, findByEmail, findByToken, quotaReached, updateQuota };
