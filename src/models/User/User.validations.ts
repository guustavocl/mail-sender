import { Types } from "mongoose";
import { z } from "zod";

const create = z.object({
  body: z.object({
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
    quota: z
      .string({
        required_error: "Quota is required",
      })
      .transform(quota => {
        return parseInt(quota);
      }),
    isAdmin: z.string().transform(isAdmin => {
      return Boolean(isAdmin);
    }),
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
