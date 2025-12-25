export const validateName = (name) => {
  if (!name.trim()) {
    return "Name is required";
  }
  if (name.trim().length < 3) {
    return "Name must be at least 3 characters";
  }
  return "";
};

export const validateEmail = (email) => {
  if (!email.trim()) {
    return "Email is required";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address";
  }
  return "";
};

export const validatePassword = (password) => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 5) {
    return "Password must be at least 5 characters";
  }
  return "";
};

export const validateRegisterForm = ({ name, email, password }) => {
  const errors = {};

  const nameError = validateName(name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;

  return errors;
};

// Blog validation
export const validateBlogTitle = (title) => {
  if (!title || !title.trim()) {
    return "Title is required";
  }
  return "";
};

export const validateBlogContent = (content) => {
  const strippedContent = content.replace(/<[^>]*>/g, "").trim();

  if (!content || !strippedContent || content === "<p><br></p>") {
    return "Content is required";
  }
  return "";
};

export const validateBlogForm = ({ title, content }) => {
  const errors = {};

  const titleError = validateBlogTitle(title);
  if (titleError) errors.title = titleError;

  const contentError = validateBlogContent(content);
  if (contentError) errors.content = contentError;

  return errors;
};
