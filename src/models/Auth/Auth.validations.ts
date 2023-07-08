import { Types } from "mongoose";
import { z } from "zod";

const login = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
      })
      .toLowerCase()
      .email("Insert a valid email"),
    password: z
      .string({
        required_error: "Password is required",
      })
      .min(6, "Must be at least 6 characters length"),
  }),
});

const logout = z.object({
  params: z.object({
    userId: z.string().refine(val => {
      return Types.ObjectId.isValid(val);
    }),
  }),
});

export const AuthValidations = { login, logout };
