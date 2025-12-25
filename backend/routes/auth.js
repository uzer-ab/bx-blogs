import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  login,
  logout,
  register,
  getCurrentUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", login);

router.post("/register", register);

router.get("/logout", protect, logout);

router.get("/check-session", protect, getCurrentUser);

export default router;
