import { Request } from "express";
import { AnyZodObject } from "zod";

export const validate = async (schema: AnyZodObject, req: Request) => {
  return await schema.parseAsync({
    body: req.body,
    query: req.query,
    params: req.params,
  });
};
