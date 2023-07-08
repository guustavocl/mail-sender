import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

export const AuthRoutes = Router();

AuthRoutes.route("/login").post(AuthController.login);
AuthRoutes.route("/logout").post(AuthController.logout);
