import jwt from "jsonwebtoken";
import Session from "../models/Session.js";

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

export const generateToken = (userId, sessionId, expiresIn = "2h") => {
  return jwt.sign({ uid: userId, sid: sessionId }, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};

export const createSession = async (
  userId,
  req,
  timeInSeconds = 7 * 24 * 60 * 60 * 1000
) => {
  if (!userId) {
    throw {
      status: 400,
      message: "Bad Request - Invalid userId for session creation",
    };
  }

  const session = await Session.create({
    userId,
    userAgent: req.get("User-Agent"),
    ip: req.ip,
    expiresAt: new Date(Date.now() + timeInSeconds),
  });

  return session;
};
