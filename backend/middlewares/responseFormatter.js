const statusCodes = {
  ok: 200,
  created: 201,
  accepted: 202,
  noContent: 204,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  internalServerError: 500,
  serviceUnavailable: 503,
};

export const responseFormatter = (req, res, next) => {
  res.ok = (data, message = "OK") => {
    res.status(statusCodes.ok).json({
      success: true,
      message,
      data,
    });
  };

  res.created = (data, message = "Created") => {
    res.status(statusCodes.created).json({
      success: true,
      message,
      data,
    });
  };

  res.accepted = (data, message = "Accepted") => {
    res.status(statusCodes.accepted).json({
      success: true,
      message,
      data,
    });
  };

  res.noContent = (message = "No Content") => {
    // 204 No Content typically does not send a body
    res.status(statusCodes.noContent).send();
  };

  res.badRequest = (message = "Bad Request", error = {}) => {
    res.status(statusCodes.badRequest).json({
      success: false,
      message,
      error,
    });
  };

  res.unauthorized = (message = "Unauthorized", error = {}) => {
    res.status(statusCodes.unauthorized).json({
      success: false,
      message,
      error,
    });
  };

  res.forbidden = (message = "Forbidden", error = {}) => {
    res.status(statusCodes.forbidden).json({
      success: false,
      message,
      error,
    });
  };

  res.notFound = (message = "Not Found", error = {}) => {
    res.status(statusCodes.notFound).json({
      success: false,
      message,
      error,
    });
  };

  res.internalServerError = (message = "Internal Server Error", error = {}) => {
    res.status(statusCodes.internalServerError).json({
      success: false,
      message,
      error,
    });
  };

  res.serviceUnavailable = (message = "Service Unavailable", error = {}) => {
    res.status(statusCodes.serviceUnavailable).json({
      success: false,
      message,
      error,
    });
  };

  res.success = res.ok;
  res.error = res.badRequest;

  next();
};
