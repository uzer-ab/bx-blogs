import Blog from "../models/Blog.js";

export const postBlog = async (req, res) => {
  const { title, content } = req.body;
  const authorId = req.user._id;
  try {
    if (!title || !content) {
      return res.error("Missing Data - Title or Concent is missing");
    }

    const blog = await Blog.create({
      title,
      content,
      author: authorId,
    });

    return res.success({ blog, message: "Blog Posted" });
  } catch (error) {
    console.error(error);
    return res.error("An error occurred while creating the blog");
  }
};

export const updateBlog = async (req, res) => {
  const { id: blogPostId } = req.params;

  const { title, content } = req.body;
  try {
    const blog = await Blog.findByIdAndUpdate(
      blogPostId,
      { title, content },
      { new: true, runValidators: true }
    );

    return res.success({ blog, message: "Blog updated!" });
  } catch (error) {
    console.error(error);
    return res.internalServerError(
      "An error occurred while updating the blog post"
    );
  }
};

export const getBlogById = async (req, res) => {
  const { id: blogPostId } = req.params;

  try {
    const blogPost = await Blog.findById(blogPostId).populate(
      "author",
      "_id name email"
    );

    if (!blogPost) {
      return res.notFound("Blog Post not Found!");
    }

    return res.success(blogPost);
  } catch (error) {
    console.error(error);
    return res.internalServerError(
      `An error occurred while Fetching the blog for id = ${id}`
    );
  }
};

export const fetchAllBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const size = parseInt(req.query.size) || 10;
  try {
    const skip = (page - 1) * size;
    const limit = size;

    const filter = { deleted: false };

    if (req.isUserRoute) {
      filter.author = req.user._id;
    }

    const blogs = await Blog.find(filter)
      .populate("author", "_id name email")
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(filter);
    const hasNext = page * size < total;

    const data = {
      blogs,
      pagination: {
        total,
        hasNext,
        page,
      },
    };

    return res.success(data);
  } catch (error) {
    console.error(error);
    return res.internalServerError("Error fetching blogs.");
  }
};

export const deleteBlog = async (req, res) => {
  const { id: blogPostId } = req.params;

  try {
    const result = await Blog.findByIdAndUpdate(blogPostId, { deleted: true });

    return res.noContent();
  } catch (error) {
    console.error(error);
    return res.internalServerError(
      "An error occurred while deleting the blog post"
    );
  }
};
