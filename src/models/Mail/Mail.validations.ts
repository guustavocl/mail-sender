import { z } from "zod";

const send = z.object({
  body: z.object({
    from: z
      .string({
        required_error: "From email is required",
      })
      .toLowerCase()
      .email("Insert a valid from email"),
    fromName: z.string().optional(),
    to: z
      .string({
        required_error: "To email is required",
      })
      .toLowerCase()
      .email("Insert a valid To email"),
    toName: z.string().optional(),
    subject: z
      .string({
        required_error: "Subject is required",
      })
      .min(1, "Subject must have at least one char lenght"),
    text: z.string().optional(),
    html: z.string().optional(),
  }),
});

const massSend = z.object({
  body: z.object({
    from: z
      .string({
        required_error: "From email is required",
      })
      .toLowerCase()
      .email("Insert a valid from email"),
    fromName: z.string().optional(),
    toList: z
      .object({
        name: z.string().optional(),
        email: z.string({ required_error: "Email of element on mail list must be informed" }),
      })
      .array(),
    subject: z
      .string({
        required_error: "Subject is required",
      })
      .min(1, "Subject must have at least one char lenght"),
    text: z.string().optional(),
    html: z.string().optional(),
  }),
});

export const MailValidations = { send, massSend };
