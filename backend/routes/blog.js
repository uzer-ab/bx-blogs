import express from "express";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  return res.send({ message: "POSTS ROUTE" });
});

router.get("/:id", async (req, res) => {
  return res.send({ message: "POST ROUTE" });
});

router.post("/", protect, async (req, res) => {
  return res.send({ message: "POST CREATE ROUTE" });
});

router.delete("/:id", protect, async (req, res) => {
  return res.send({ message: "DELETE ROUTE" });
});

export default router;
