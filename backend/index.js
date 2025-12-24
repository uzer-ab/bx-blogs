import express from "express";
import dotenv from "dotenv";

import authRouter from "./routes/auth.js";
import blogRouter from "./routes/blog.js";
import { connectDB } from "./config/db.js";
import { responseFormatter } from "./middlewares/responseFormatter.js";

dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use(responseFormatter);

app.use("/api/v1/auth", authRouter);
app.use("apip/v1/blogs", blogRouter);

app.use("/api/v1", (req, res) => {
  res.send({ message: "Server is Running!" });
});

const PORT = process.env.PORT || 1234;
app.listen(PORT, (error) => {
  if (error) {
    console.log(`Error starting Server - Error: ${error}`);
  } else {
    console.log(`🚀 Server running on port ${PORT}`);
  }
});
