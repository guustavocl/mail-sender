import { User } from "../../models/User/User.model";
import { UserProps } from "../../models/User/User.types";

export const quotaReached = (user: UserProps) => {
  if (!user.isAdmin && user.sended > user.quota) return true;
};

export const updateQuota = async (userEmail: string) => {
  return await User.findOneAndUpdate({ email: userEmail }, { $inc: { sended: 1 } });
};
