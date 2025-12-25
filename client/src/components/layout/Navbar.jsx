import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { PenSquare, LogOut, User, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await dispatch(logout());
    navigate("/");
  };

  const handleMyBlogs = () => {
    handleMenuClose();
    navigate("/my-blogs");
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-primary">
          BlogHub
        </Link>

        <div className="flex items-center gap-4">
          <Button
            component={Link}
            to="/"
            variant="text"
            startIcon={<BookOpen className="h-4 w-4" />}
          >
            Blogs
          </Button>

          {isAuthenticated ? (
            <>
              <Button
                component={Link}
                to="/blogs/new"
                variant="outlined"
                startIcon={<PenSquare className="h-4 w-4" />}
              >
                Write
              </Button>

              <IconButton
                onClick={handleMenuOpen}
                aria-controls={open ? "user-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <User className="h-5 w-5" />
              </IconButton>

              <Menu
                id="user-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                slotProps={{
                  paper: {
                    sx: { minWidth: 180 },
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="body2" fontWeight="medium">
                    {user?.name || user?.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleMyBlogs}>
                  <BookOpen className="h-4 w-4 mr-2" />
                  My Blogs
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" variant="text">
                Login
              </Button>
              <Button component={Link} to="/register" variant="contained">
                Sign Up
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
