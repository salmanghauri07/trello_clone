import dotenv from "dotenv";
dotenv.config();

const config = {
  MONGO_URI: process.env.MONGO_URI,
  ETHEREAL_USERNAME: process.env.ETHEREAL_USERNAME,
  ETHEREAL_PASSWORD: process.env.ETHEREAL_PASSWORD,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};

export default config;
