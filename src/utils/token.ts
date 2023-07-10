import bcrypt from "bcryptjs";
import crypto from "crypto";

export const createNewToken = async (email: string): Promise<string> => {
  const c = crypto.randomBytes(32).toString("hex");
  const userToken = await bcrypt.hash(c + email, bcrypt.genSaltSync(12));
  return userToken;
};
