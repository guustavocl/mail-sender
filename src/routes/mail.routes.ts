import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { MailController } from "../controllers/mail.controller";

export const MailRoutes = Router();

MailRoutes.route("/").post(authenticate(), MailController.send);
MailRoutes.route("/mass").post(authenticate(), MailController.massSend);
