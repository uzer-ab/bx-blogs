import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { register, clearError } from "@/store/slices/authSlice";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Spinner from "@/components/common/Spinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { toast } from "sonner";
import { validateRegisterForm } from "@/utils/validation";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegisterForm({ name, email, password });

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await dispatch(register({ name, email, password }));
    if (!result.error) {
      toast.success("Registration successful! Please login.");
      navigate("/login");
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    if (errors.name) {
      setErrors({ ...errors, name: "" });
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors({ ...errors, email: "" });
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({ ...errors, password: "" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card sx={{ width: "100%", maxWidth: 448 }}>
        <CardContent>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h5"
              component="h1"
              fontWeight="bold"
              gutterBottom
            >
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign up to start writing blogs
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <ErrorMessage message={error} />

              <TextField
                id="name"
                label="Name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={handleNameChange}
                error={!!errors.name}
                helperText={errors.name}
                required
                fullWidth
              />

              <TextField
                id="email"
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={handleEmailChange}
                error={!!errors.email}
                helperText={errors.email}
                required
                fullWidth
              />

              <TextField
                id="password"
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                error={!!errors.password}
                helperText={errors.password}
                required
                fullWidth
              />
            </Box>

            <CardActions sx={{ flexDirection: "column", gap: 2, px: 0, pt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                size="large"
              >
                {loading ? <Spinner size="small" /> : "Create Account"}
              </Button>

              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
              >
                Already have an account?{" "}
                <Link to="/login" style={{ color: "inherit", fontWeight: 500 }}>
                  Sign in
                </Link>
              </Typography>
            </CardActions>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
