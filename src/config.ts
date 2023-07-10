import SES from "aws-sdk/clients/ses";
import dotenv from "dotenv";
dotenv.config();
const production = process.env.NODE_MODE === "production";

const SESClient = new SES({
  region: "us-east-1",
});

export const config = {
  env: process.env.NODE_MODE,
  production: production,
  port: production ? 3000 : 3333,
  timeout: "30s",
  requestSizeLimit: "10mb",
  mongoose: {
    url: (production ? process.env.MONGO_PRODUCTION_URL : process.env.MONGO_DEVELOPMENT_URL) || "",
    options: {
      retryWrites: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  redis: {
    host: (production ? process.env.REDIS_PRODUCTION_HOST : process.env.REDIS_DEVELOPMENT_HOST) || "",
    port: (production ? process.env.REDIS_PRODUCTION_PORT : process.env.REDIS_DEVELOPMENT_PORT) || 6379,
    password: process.env.REDIS_PWD || "",
  },
  sesClient: SESClient,
  jwtSecret: process.env.JWT_SECRET || "",
  jwtExpiresIn: "24h",
  authCookie: "express_auth",
};
