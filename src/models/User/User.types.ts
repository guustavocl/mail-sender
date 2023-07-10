import { Document } from "mongoose";

export interface UserProps extends Document {
  name: string;
  email: string;
  token: string;
  quota: number;
  sended: number;
  isBanned: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
  isPasswordMatch: (email: string) => boolean;
}
