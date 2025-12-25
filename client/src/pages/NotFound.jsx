import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const NotFound = () => {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 4rem)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Typography
        variant="h1"
        sx={{
          fontSize: "4rem",
          fontWeight: "bold",
          color: "primary.main",
          mb: 2,
        }}
      >
        404
      </Typography>

      <Typography variant="h5" color="text.secondary" sx={{ mb: 4 }}>
        Page not found
      </Typography>

      <Button component={Link} to="/" variant="contained">
        Go Home
      </Button>
    </Box>
  );
};

export default NotFound;
