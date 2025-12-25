import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { blogService } from "../../services/blogService";

const initialState = {
  blogs: [],
  userBlogs: [],
  currentBlog: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    size: 10,
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
        state.blogs = action.payload.data.blogs || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
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
        state.userBlogs = action.payload.data.blogs || action.payload;
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
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
        const index = state.blogs.findIndex(
          (blog) => blog._id === updatedBlog._id
        );
        if (index !== -1) {
          state.blogs[index] = updatedBlog;
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
      })
      .addCase(deleteBlog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentBlog, clearError } = blogSlice.actions;
export default blogSlice.reducer;
