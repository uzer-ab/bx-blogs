import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database connected successfully!");
  } catch (err) {
    console.error("Error connecting DB - Error: ", err.message);
    process.exit(1);
  }
};
