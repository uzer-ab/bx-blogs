import express from "express";
import { protect } from "../middlewares/auth";

const router = express.Router();

router.post("/login", async (req, res) => {
  return res.send({ message: "LOGIN ROUTE" });
});

router.post("/register", (req, res) => {
  return res.send({ message: "REGISTER ROUTE" });
});

router.get("/logout", protect, async (req, res) => {
  return res.send({ message: "LOGOUT ROUTE" });
});

export default router;
