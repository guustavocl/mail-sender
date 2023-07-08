import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware";
import { UserController } from "../controllers/user.controller";

export const UserRoutes = Router();

UserRoutes.route("/").get(authenticate(), UserController.getAll).post(UserController.create);

UserRoutes.route("/:userId").get(authenticate(), UserController.getOne);
