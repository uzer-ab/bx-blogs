import Blog from "../models/Blog.js";

export const blogExists = async (req, res, next) => {
  const { id: blogPostId } = req.params;

  if (!blogPostId) {
    return res.error("Missing blog post id");
  }
  try {
    const blog = await Blog.findById(blogPostId)
      .where("deleted")
      .equals(false)
      .select("_id")
      .lean();

    if (!blog) {
      return res.notFound("Blog Post not Found");
    }
    next();
  } catch (error) {
    console.error(error);
    return res.internalServerError("An error occurred while checking the blog");
  }
};
