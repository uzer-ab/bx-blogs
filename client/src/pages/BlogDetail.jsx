import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBlogById,
  clearCurrentBlog,
  deleteBlog,
} from "@/store/slices/blogSlice";
import Spinner from "@/components/common/Spinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ArrowLeft, Calendar, User, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentBlog, loading, error } = useSelector((state) => state.blogs);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogById(id));
    return () => {
      dispatch(clearCurrentBlog());
    };
  }, [dispatch, id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isOwner =
    isAuthenticated && user && currentBlog?.author?._id === user._id;

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const result = await dispatch(deleteBlog(id));

    if (result.error) {
      toast.error("Failed to delete blog");
    } else {
      toast.success("Blog deleted successfully!");
      navigate("/my-blogs");
    }

    setDeleteDialogOpen(false);
  };

  const handleDialogClose = () => {
    setDeleteDialogOpen(false);
  };

  if (loading) {
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

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <ErrorMessage message={error} />
        <Button
          variant="outlined"
          startIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Back to Blogs
        </Button>
      </Container>
    );
  }

  if (!currentBlog) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="body1" color="text.secondary">
          Blog not found
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Back to Blogs
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button
        variant="text"
        startIcon={<ArrowLeft className="h-4 w-4" />}
        onClick={() => navigate("/")}
        sx={{ mb: 3 }}
      >
        Back to Blogs
      </Button>

      <Card>
        <CardHeader
          title={
            <Typography variant="h4" component="h1" fontWeight="bold">
              {currentBlog.title}
            </Typography>
          }
          subheader={
            <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <User className="h-4 w-4" />
                {currentBlog.author?.name || "Anonymous"}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
              >
                <Calendar className="h-4 w-4" />
                {formatDate(currentBlog.createdAt)}
              </Typography>
            </Box>
          }
          action={
            isOwner && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  component={Link}
                  to={`/blogs/edit/${currentBlog._id}`}
                  variant="outlined"
                  size="small"
                  startIcon={<Pencil className="h-4 w-4" />}
                >
                  Edit
                </Button>
                <IconButton
                  onClick={handleDeleteClick}
                  color="error"
                  size="small"
                  aria-label="delete"
                >
                  <Trash2 className="h-5 w-5" />
                </IconButton>
              </Box>
            )
          }
        />
        <CardContent>
          <Box
            sx={{
              typography: "body1",
              "& h1": { fontSize: "2rem", fontWeight: "bold", mt: 3, mb: 2 },
              "& h2": { fontSize: "1.75rem", fontWeight: "bold", mt: 3, mb: 2 },
              "& h3": {
                fontSize: "1.5rem",
                fontWeight: "bold",
                mt: 2,
                mb: 1.5,
              },
              "& p": { mb: 2, lineHeight: 1.7 },
              "& img": { maxWidth: "100%", height: "auto", my: 2 },
              "& a": { color: "primary.main", textDecoration: "underline" },
              "& ul, & ol": { mb: 2, pl: 4 },
              "& blockquote": {
                borderLeft: "4px solid",
                borderColor: "divider",
                pl: 2,
                py: 1,
                my: 2,
                fontStyle: "italic",
                color: "text.secondary",
              },
              "& code": {
                bgcolor: "grey.100",
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontFamily: "monospace",
              },
              "& pre": {
                bgcolor: "grey.100",
                p: 2,
                borderRadius: 1,
                overflow: "auto",
                mb: 2,
              },
            }}
            dangerouslySetInnerHTML={{ __html: currentBlog.content }}
          />
        </CardContent>
      </Card>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Delete Blog</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete this blog? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BlogDetail;
