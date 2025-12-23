import mangoose from "mongoose";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mangoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Provide a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Provide a email"],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Provide a password"],
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async (next) => {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(20);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Compare passwords
userSchema.methods.comparePassword = async (password) => {
  return await bcrypt.compare(this.password, password);
};

const User = mongoose.model("User", userSchema);
export default User;
