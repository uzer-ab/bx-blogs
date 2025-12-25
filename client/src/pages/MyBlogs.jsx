import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserBlogs, deleteBlog } from "@/store/slices/blogSlice";
import BlogCard from "@/components/blog/BlogCard";
import Spinner from "@/components/common/Spinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Plus } from "lucide-react";
import { toast } from "sonner";

const MyBlogs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userBlogs, loading, error } = useSelector((state) => state.blogs);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    dispatch(fetchUserBlogs({ page: 1, size: 10 }));
  }, [dispatch]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(fetchUserBlogs({ page: 1, size: 100 }));
  }, [dispatch, isAuthenticated, navigate]);

  const myBlogs = userBlogs.filter((blog) => blog.author?._id === user?._id);

  const handleEdit = (id) => {
    navigate(`/blogs/edit/${id}`);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    const result = await dispatch(deleteBlog(deleteId));

    if (result.error) {
      toast.error("Failed to delete blog");
    } else {
      toast.success("Blog deleted successfully!");
    }

    setDeleteId(null);
  };

  const handleDialogClose = () => {
    setDeleteId(null);
  };

  if (loading && userBlogs.length === 0) {
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Typography variant="h3" component="h1" fontWeight="bold">
          My Blogs
        </Typography>
        <Button
          variant="contained"
          startIcon={<Plus className="h-4 w-4" />}
          onClick={() => navigate("/blogs/new")}
        >
          New Blog
        </Button>
      </Box>

      <ErrorMessage message={error} sx={{ mb: 2 }} />

      {myBlogs.length === 0 && !loading ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            You haven't written any blogs yet.
          </Typography>
          <Button
            variant="contained"
            startIcon={<Plus className="h-4 w-4" />}
            onClick={() => navigate("/blogs/new")}
            sx={{ mt: 2 }}
          >
            Write Your First Blog
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {myBlogs.map((blog) => (
            <Grid item xs={12} md={6} lg={4} key={blog._id}>
              <BlogCard
                blog={blog}
                isOwner={true}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={!!deleteId}
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

export default MyBlogs;
