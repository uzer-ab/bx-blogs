import Session from "../models/Session.js";
import User from "../models/User.js";
import { createSession, generateToken } from "../utils/auth.js";
import validator from "validator";

const { isEmail } = validator;

export const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!isEmail(email)) {
    return res.error("Invalid email format");
  }

  if (name.length < 3) {
    return res.error("Name must be at least 3 characters long");
  }

  if (password.length < 5) {
    return res.error("Password must be at least 5 characters long");
  }

  const userExists = await User.findOne({ email }).select("_id").lean();
  if (userExists) {
    return res.forbidden("User with the email already exists!");
  }

  try {
    const user = await User.create({
      name,
      email,
      password,
    });

    res.created(user, "User Created!");
  } catch (err) {
    console.log(`Something went wrong, please try again. ${err}`);
    return res.internalServerError("Something went wrong, please try again.");
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!isEmail(email)) {
    return res.error("Invalid email format");
  }

  if (password.length < 5) {
    return res.error("Password must be at least 5 characters long");
  }

  if (!!email && !!password) {
    try {
      const user = await User.findOne({ email, is_active: true }).select(
        "+password"
      );
      if (!user) {
        return res.notFound("User not found!");
      }

      if (!(await user.comparePassword(password))) {
        return res.unauthorized("Invalid email or password!");
      }

      const session = await createSession(user._id, req);
      const token = generateToken(user._id, session._id);

      return res.success({ token, user }, "Login Successful");
    } catch (err) {
      console.log(`Something went wrong, please try again. ${err}`);
      return res.internalServerError("Something went wrong, please try again.");
    }
  }

  return res.error("Invalid login credentials");
};

export const logout = async (req, res) => {
  const { userId, _id: sessionId } = req.session || {};

  const session = await Session.updateOne(
    { _id: sessionId, userId },
    { revoked: true }
  );
  req.user = null;
  req.session = null;

  return res.noContent();
};
