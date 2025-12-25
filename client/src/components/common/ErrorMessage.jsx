import { AlertCircle } from "lucide-react";
import Alert from "@mui/material/Alert";

const ErrorMessage = ({ message, className = "" }) => {
  if (!message) return null;

  return (
    <Alert
      severity="error"
      icon={<AlertCircle className="h-4 w-4" />}
      className={className}
    >
      {message}
    </Alert>
  );
};

export default ErrorMessage;
