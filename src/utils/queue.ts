import Bull from "bull";
import httpStatus from "http-status";

import { config } from "../config";
import { MailProps } from "../models/Mail/Mail.types";
import { UserProps } from "../models/User/User.types";
import { MailService } from "../services/Mail";
import { quotaReached, updateQuota } from "../services/User/user.quota";
import { ApiError } from "./ApiError";
import logger from "./logger";

let mailQueue: Bull.Queue;

config.sesClient
  .getSendQuota()
  .promise()
  .then(data => {
    mailQueue = new Bull("mail-queue", {
      defaultJobOptions: {
        removeOnComplete: true,
        attempts: 5,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
      },
      limiter: {
        max: 10 * (data.MaxSendRate || 10),
        duration: 10 * 1000,
      },
      redis: {
        host: config.redis.host,
        port: Number(config.redis.port),
        password: config.redis.password,
      },
    });

    startProcessQueue();
  });

export const addToQueue = async (data: MailProps, user: UserProps) => {
  if (!mailQueue) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Mail queue not found");
  await mailQueue.add({ ...data, user: user });
  console.log("added to queue");
};

export const massAddToQueue = async (data: MailProps, user: UserProps) => {
  if (!mailQueue) throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Mail queue not found");

  if (data.toList.length === 0)
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Mail list must have at least one email");

  const parsedJobs = data.toList.map(jobData => {
    return {
      data: {
        from: data.from,
        fromName: data.fromName,
        to: jobData.email,
        toName: jobData.name,
        subject: data.subject,
        text: data.text,
        html: data.html,
        setName: data.setName,
        user: user,
      },
    };
  });

  await mailQueue.addBulk(parsedJobs);
  return;
};

const startProcessQueue = () => {
  console.log("start queue proccess");
  mailQueue.process(async job => {
    console.log("neww process: ", job.data);
    try {
      const updatedUser = await updateQuota(job.data.user.email);
      if (updatedUser && !quotaReached(updatedUser)) {
        console.log("will send");
        MailService.send(job.data);
      }
    } catch (error) {
      logger.error("Error on Process queue");
      console.log(error);
    }
  });
};
