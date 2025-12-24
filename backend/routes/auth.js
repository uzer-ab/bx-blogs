import express from "express";
import { protect } from "../middlewares/auth.js";
import { login, logout, register } from "../controllers/userController.js";

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.get("/logout", protect, logout);

export default router;
