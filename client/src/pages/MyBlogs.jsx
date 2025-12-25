import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserBlogs,
  deleteBlog,
  resetUserBlogs,
} from "@/store/slices/blogSlice";
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
  const { userBlogs, loading, error, userBlogsPagination } = useSelector(
    (state) => state.blogs
  );
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [deleteId, setDeleteId] = useState(null);

  const observerTarget = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    dispatch(resetUserBlogs());
    dispatch(fetchUserBlogs({ page: 1, size: 10 }));
  }, [dispatch, isAuthenticated, navigate]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          userBlogsPagination.hasNext &&
          !loading
        ) {
          dispatch(
            fetchUserBlogs({ page: userBlogsPagination.page + 1, size: 10 })
          );
        }
      },
      { threshold: 0.5 }
    );

    const currentTarget = observerTarget.current;

    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [
    userBlogsPagination.hasNext,
    userBlogsPagination.page,
    loading,
    dispatch,
  ]);

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

      {userBlogs.length === 0 && !loading ? (
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
        <>
          <Grid container spacing={3}>
            {userBlogs.map((blog) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={blog._id}>
                <BlogCard
                  blog={blog}
                  isOwner={true}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              </Grid>
            ))}
          </Grid>

          {userBlogsPagination.hasNext && (
            <Box
              ref={observerTarget}
              sx={{
                height: "100px",
                mt: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loading && <Spinner size="small" />}
            </Box>
          )}

          {loading && !userBlogsPagination.hasNext && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Spinner size="small" />
            </Box>
          )}
        </>
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
