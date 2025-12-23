import User from "../models/User.js";
import Session from "../models/Session.js";
import { verifyToken } from "../utils/auth.js";

export const protect = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token" });
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = verifyToken(token);

    const { uid, sid } = decoded;

    const session = await Session.findOne({
      _id: sid,
      userId: uid,
      revoked: false,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return res.status(401).json({ message: "Invalid session" });
    }

    req.user = await User.findById(uid).select("-password");
    next();
  } catch (err) {
    res.status(401).json({ message: "Unauthorized" });
  }
};
