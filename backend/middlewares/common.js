export const markAsUserRoute = (req, res, next) => {
  req.isUserRoute = true;
  next();
};
