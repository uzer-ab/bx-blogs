import express from "express";
import { protect } from "../middlewares/auth.js";
import {
  getBlogById,
  postBlog,
  fetchAllBlogs,
  deleteBlog,
  updateBlog,
} from "../controllers/blogController.js";
import { blogExists } from "../middlewares/blogs.js";

const router = express.Router();

router.get("/", fetchAllBlogs);

router.get("/:id", blogExists, getBlogById);

router.post("/", protect, postBlog);

router.put("/:id", protect, blogExists, updateBlog);

router.delete("/:id", protect, blogExists, deleteBlog);

export default router;
