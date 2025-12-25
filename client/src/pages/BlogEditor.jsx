import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import {
  createBlog,
  updateBlog,
  fetchBlogById,
  clearCurrentBlog,
} from "@/store/slices/blogSlice";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Spinner from "@/components/common/Spinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const BlogEditor = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentBlog, loading, error } = useSelector((state) => state.blogs);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (isEditing) {
      dispatch(fetchBlogById(id));
    }

    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch, id, isEditing, isAuthenticated, navigate]);

  useEffect(() => {
    if (isEditing && currentBlog) {
      // Check if user is the owner
      if (currentBlog.author?._id !== user?._id) {
        toast.error("You can only edit your own blogs");
        navigate("/");
        return;
      }
      setTitle(currentBlog.title);
      setContent(currentBlog.content);
    }
  }, [currentBlog, isEditing, user, navigate]);

  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        ["blockquote", "code-block"],
        ["link", "image"],
        [{ color: [] }, { background: [] }],
        ["clean"],
      ],
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "indent",
    "blockquote",
    "code-block",
    "link",
    "image",
    "color",
    "background",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (!title.trim()) {
      setValidationError("Title is required");
      return;
    }

    if (!content.trim() || content === "<p><br></p>") {
      setValidationError("Content is required");
      return;
    }

    let result;
    if (isEditing) {
      result = await dispatch(updateBlog({ id, title, content }));
    } else {
      result = await dispatch(createBlog({ title, content }));
    }

    if (!result.error) {
      toast.success(
        isEditing ? "Blog updated successfully!" : "Blog created successfully!"
      );
      navigate("/my-blogs");
    }
  };

  if (loading && isEditing && !currentBlog) {
    return (
      <Box
        sx={{
          minHeight: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Spinner size="large" />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: "896px", mx: "auto", px: 2, py: 4 }}>
      <Button
        variant="text"
        startIcon={<ArrowLeft className="h-4 w-4" />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back
      </Button>

      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h5"
            component="h1"
            fontWeight="bold"
            gutterBottom
          >
            {isEditing ? "Edit Blog" : "Create New Blog"}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <ErrorMessage message={error || validationError} />

              <TextField
                id="title"
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter blog title..."
                required
                fullWidth
              />

              <FormControl fullWidth>
                <InputLabel
                  shrink
                  htmlFor="content-editor"
                  sx={{ bgcolor: "background.paper", px: 1 }}
                >
                  Content
                </InputLabel>
                <Box
                  id="content-editor"
                  sx={{
                    minHeight: "300px",
                    mt: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 1,
                    "& .quill": {
                      height: "250px",
                    },
                  }}
                >
                  <ReactQuill
                    theme="snow"
                    value={content}
                    onChange={setContent}
                    modules={modules}
                    formats={formats}
                    placeholder="Write your blog content..."
                  />
                </Box>
              </FormControl>
            </Box>

            <Box sx={{ display: "flex", gap: 2, mt: 15 }}>
              <Button type="submit" variant="contained" disabled={loading}>
                {loading ? (
                  <Spinner size="small" />
                ) : isEditing ? (
                  "Update Blog"
                ) : (
                  "Publish Blog"
                )}
              </Button>
              <Button
                type="button"
                variant="outlined"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default BlogEditor;
