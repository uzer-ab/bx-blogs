import { Link } from "react-router-dom";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import { Calendar, User, Pencil, Trash2 } from "lucide-react";

const BlogCard = ({ blog, isOwner = false, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stripHtml = (html) => {
    const tmp = document.createElement("div");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const excerpt = stripHtml(blog.content).substring(0, 150) + "...";

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.3s ease-in-out",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            mb: 2,
          }}
        >
          <Link
            to={`/blogs/${blog._id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.target.style.color = "#1976d2")}
            onMouseLeave={(e) => (e.target.style.color = "inherit")}
          >
            {blog.title}
          </Link>
        </Typography>

        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <User className="h-4 w-4" />
            {blog.author?.name || "Anonymous"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Calendar className="h-4 w-4" />
            {formatDate(blog.createdAt)}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {excerpt}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: "space-between", px: 2, pb: 2 }}>
        <Button
          component={Link}
          to={`/blogs/${blog._id}`}
          variant="outlined"
          size="small"
        >
          Read More
        </Button>

        {isOwner && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => onEdit(blog._id)}
              aria-label="edit"
            >
              <Pencil className="h-4 w-4" />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => onDelete(blog._id)}
              color="error"
              aria-label="delete"
            >
              <Trash2 className="h-4 w-4" />
            </IconButton>
          </Box>
        )}
      </CardActions>
    </Card>
  );
};

export default BlogCard;
