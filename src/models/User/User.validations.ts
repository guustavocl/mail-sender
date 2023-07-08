import { Types } from "mongoose";
import { z } from "zod";

const create = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: "Name is required",
        })
        .min(1, "Name must have more than 1 char"),
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
      confirmPassword: z
        .string({
          required_error: "Password confirmation is required",
        })
        .min(6, "Must be at least 6 characters length"),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: "Passwords must match!",
      path: ["confirmPassword"],
    }),
});

const findOne = z.object({
  params: z.object({
    userId: z.string().refine(val => {
      return Types.ObjectId.isValid(val);
    }, "Must be a valid userId"),
  }),
});

const findAll = z.object({
  query: z.object({
    name: z.string().optional(),
    sortBy: z.string().optional(),
    limit: z
      .string()
      .optional()
      .transform(limit => limit && parseInt(limit))
      .refine(limit => {
        if (limit && limit > 100) return false;
        return true;
      }, "Limit must be less than 100"),
    page: z
      .string()
      .transform(page => page && parseInt(page))
      .optional(),
  }),
});

export const UserValidations = { create, findOne, findAll };
