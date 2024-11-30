import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.ATLAS_URI, { useNewUrlParser: true });
    console.log("Connected to DB");
  } catch (error) {
    console.log('connection error', error);
    process.exit(1);
  }
};

export default connectDB;
