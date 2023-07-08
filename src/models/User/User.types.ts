import { Document } from "mongoose";

export interface UserProps extends Document {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  loginCount: string;
  lastLoginIP: string;
  lastLoginDate: Date;
  isEmailConfirmed: boolean;
  isBanned: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  isPasswordMatch: (email: string) => boolean;
}
