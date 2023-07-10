import { Router } from "express";
import { UserRoutes } from "./routes/user.routes";
import { MailRoutes } from "./routes/mail.routes";

const router = Router();

router.use("/user", UserRoutes);
router.use("/mail", MailRoutes);

/* UPTIME CHECK */
router.get("/ping", (req, res) => res.status(200).json({ message: "pong" }));

/*  NOT FOUND */
router.get("*", (req, res) => res.status(404).json({ message: "Not Found~" }));

export { router };
