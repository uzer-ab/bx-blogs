import User from "../models/User.js";
import Session from "../models/Session.js";
import { verifyToken } from "../utils/auth.js";

export const protect = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization?.startsWith("Bearer ")) {
    res.unauthorized("No Token");
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
      res.error("Invalid session");
    }

    req.user = await User.findById(uid);
    req.session = session;

    next();
  } catch (err) {
    console.log(`Invalid session: ${err.message}`);
    res.unauthorized("Invalid session");
  }
};
