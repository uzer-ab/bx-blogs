import jwt from "jsonwebtoken";

export const verifyToken = (token) => {
  if (!token) {
    throw { status: 401, message: "Unauthorized" };
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw { status: 401, message: "Invalid Token" };
  }
};

export const generateToken = async (userId, sessionId, expiresIn = "24h") => {
  return jwt.sign({ uid: userId, sid: sessionId }, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};
