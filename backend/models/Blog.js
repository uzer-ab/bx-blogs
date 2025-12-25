import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    deleted: {
      type: Boolean,
      default: false,
      select: false,
    },
  },
  { timestamps: true }
);

blogSchema.index({ deleted: 1, author: 1 });

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
