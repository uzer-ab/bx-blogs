import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { blogService } from "../../services/blogService";

const initialState = {
  blogs: [],
  userBlogs: [],
  currentBlog: null,
  loading: false,
  error: null,
  pagination: {
    hasNext: false,
    page: 1,
    total: 0,
  },
  userBlogsPagination: {
    hasNext: false,
    page: 1,
    total: 0,
  },
};

export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async ({ page = 1, size = 10 }, { rejectWithValue }) => {
    try {
      return await blogService.getBlogs(page, size);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blogs"
      );
    }
  }
);

export const fetchUserBlogs = createAsyncThunk(
  "blogs/fetchUserBlogs",
  async ({ page = 1, size = 10 }, { rejectWithValue }) => {
    try {
      return await blogService.getUserBlogs(page, size);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blogs"
      );
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  "blogs/fetchBlogById",
  async (id, { rejectWithValue }) => {
    try {
      return await blogService.getBlogById(id);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch blog"
      );
    }
  }
);

export const createBlog = createAsyncThunk(
  "blogs/createBlog",
  async ({ title, content }, { rejectWithValue }) => {
    try {
      return await blogService.createBlog(title, content);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create blog"
      );
    }
  }
);

export const updateBlog = createAsyncThunk(
  "blogs/updateBlog",
  async ({ id, title, content }, { rejectWithValue }) => {
    try {
      return await blogService.updateBlog(id, title, content);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update blog"
      );
    }
  }
);

export const deleteBlog = createAsyncThunk(
  "blogs/deleteBlog",
  async (id, { rejectWithValue }) => {
    try {
      await blogService.deleteBlog(id);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete blog"
      );
    }
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState,
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetBlogs: (state) => {
      state.blogs = [];
      state.pagination = {
        hasNext: false,
        page: 1,
        total: 0,
      };
    },
    resetUserBlogs: (state) => {
      state.userBlogs = [];
      state.userBlogsPagination = {
        hasNext: false,
        page: 1,
        total: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        const newBlogs = action.payload.data.blogs || action.payload;

        // Append new blogs instead of replacing
        state.blogs = [...state.blogs, ...newBlogs];

        if (action.payload.data.pagination) {
          state.pagination = action.payload.data.pagination;
        }
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch user blogs
      .addCase(fetchUserBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserBlogs.fulfilled, (state, action) => {
        state.loading = false;
        const newBlogs = action.payload.data.blogs || action.payload;

        // Append new user blogs instead of replacing
        state.userBlogs = [...state.userBlogs, ...newBlogs];

        if (action.payload.data.pagination) {
          state.userBlogsPagination = action.payload.data.pagination;
        }
      })
      .addCase(fetchUserBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch blog by ID
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload.data || action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create blog
      .addCase(createBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBlog.fulfilled, (state, action) => {
        state.loading = false;
        const newBlog = action.payload.data || action.payload;
        state.blogs.unshift(newBlog);
        state.userBlogs.unshift(newBlog);
      })
      .addCase(createBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update blog
      .addCase(updateBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBlog.fulfilled, (state, action) => {
        state.loading = false;
        const updatedBlog = action.payload.data || action.payload;

        // Update in blogs array
        const blogIndex = state.blogs.findIndex(
          (blog) => blog._id === updatedBlog._id
        );
        if (blogIndex !== -1) {
          state.blogs[blogIndex] = updatedBlog;
        }

        // Update in userBlogs array
        const userBlogIndex = state.userBlogs.findIndex(
          (blog) => blog._id === updatedBlog._id
        );
        if (userBlogIndex !== -1) {
          state.userBlogs[userBlogIndex] = updatedBlog;
        }

        state.currentBlog = updatedBlog;
      })
      .addCase(updateBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete blog
      .addCase(deleteBlog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = state.blogs.filter((blog) => blog._id !== action.payload);
        state.userBlogs = state.userBlogs.filter(
          (blog) => blog._id !== action.payload
        );
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentBlog, clearError, resetBlogs, resetUserBlogs } =
  blogSlice.actions;
export default blogSlice.reducer;
