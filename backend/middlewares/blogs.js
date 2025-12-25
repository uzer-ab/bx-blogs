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

export const isBlogBelongToUser = async (req, res, next) => {
  const { id: blogPostId } = req.params;

  if (!blogPostId) {
    return res.error("Missing blog post id");
  }
  try {
    const blog = await Blog.findById(blogPostId)
      .where("deleted")
      .equals(false)
      .select("_id author")
      .lean();

    if (!blog) {
      return res.notFound("Blog Post not Found");
    }

    // Check if the user is the author
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.forbidden("You are not authorized to perform this action");
    }

    next();
  } catch (error) {
    console.error(error);
    return res.internalServerError("An error occurred while checking the blog");
  }
};
