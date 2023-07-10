import catchAsync from "../utils/catch";
import { validate } from "../utils/validate";
import { MailValidations } from "../models/Mail/Mail.validations";
import { quotaReached } from "../services/User/user.quota";
import { addToQueue, massAddToQueue } from "../utils/queue";
import { ApiError } from "../utils/ApiError";
import httpStatus from "http-status";

const send = catchAsync(async (req, res) => {
  const { body } = await validate(MailValidations.send, req);
  if (quotaReached(res.locals.userPayload)) throw new ApiError(httpStatus.FORBIDDEN, "Sended quota reached!");

  await addToQueue(body, res.locals.userPayload);
  res.send({ message: `Mail successfully added to queue` });
});

const massSend = catchAsync(async (req, res) => {
  const { body } = await validate(MailValidations.massSend, req);
  if (quotaReached(res.locals.userPayload)) throw new ApiError(httpStatus.FORBIDDEN, "Sended quota reached!");

  await massAddToQueue(body, res.locals.userPayload);
  res.send({ message: `Mail list successfully added to queue` });
});

export const MailController = {
  send,
  massSend,
};
