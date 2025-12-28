import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs, resetBlogs } from "@/store/slices/blogSlice";
import BlogCard from "@/components/blog/BlogCard";
import Spinner from "@/components/common/Spinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Link, Navigate } from "react-router-dom";

const BlogList = () => {
  const dispatch = useDispatch();
  const { blogs, loading, error, pagination } = useSelector(
    (state) => state.blogs
  );

  const observerTarget = useRef(null);

  useEffect(() => {
    dispatch(resetBlogs());
    dispatch(fetchBlogs({ page: 1, size: 10 }));
  }, [dispatch]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && pagination.hasNext && !loading) {
          dispatch(fetchBlogs({ page: pagination.page + 1, size: 10 }));
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
  }, [pagination.hasNext, pagination.page, loading, dispatch]);

  if (loading && blogs.length === 0) {
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
      <Typography
        variant="h3"
        component="h1"
        fontWeight="bold"
        gutterBottom
        sx={{ mb: 4 }}
      >
        Latest Blogs
      </Typography>

      <ErrorMessage message={error} sx={{ mb: 2 }} />

      {blogs.length === 0 && !loading ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <Typography variant="h6" color="text.secondary">
            No blogs found. Be the first to&nbsp;
            <Link
              to="/blogs/new"
              style={{ color: "#1976d2", textDecoration: "underline" }}
            >
              write
            </Link>
            &nbsp;one!
          </Typography>
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {blogs.map((blog) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={blog._id}>
                <BlogCard blog={blog} />
              </Grid>
            ))}
          </Grid>

          {/* Observer target element - triggers loading when visible */}
          {pagination.hasNext && (
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

          {loading && !pagination.hasNext && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Spinner size="small" />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default BlogList;
