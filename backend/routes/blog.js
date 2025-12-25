import express from "express";
import { protect } from "../middlewares/auth.js";
import { markAsUserRoute } from "../middlewares/common.js";

import {
  getBlogById,
  postBlog,
  fetchAllBlogs,
  deleteBlog,
  updateBlog,
} from "../controllers/blogController.js";
import { blogExists, isBlogBelongToUser } from "../middlewares/blogs.js";

const router = express.Router();

router.get("/", fetchAllBlogs);

router.get("/user", protect, markAsUserRoute, fetchAllBlogs);

router.get("/:id", blogExists, getBlogById);

router.post("/", protect, postBlog);

router.put("/:id", protect, isBlogBelongToUser, updateBlog);

router.delete("/:id", protect, isBlogBelongToUser, deleteBlog);

export default router;
