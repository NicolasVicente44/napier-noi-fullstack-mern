import dotenv from "dotenv";
import mongoose from "mongoose";

// This loads our .env and adds the variables to the environment
dotenv.config();

export default () => {
  /**
   * Setting up Mongoose
   */
  mongoose
    .connect(`${process.env.MONGO_URL}`)
    .then(() => console.info("MongoDB Connected"))
    .catch((error) => console.error(error));
};
