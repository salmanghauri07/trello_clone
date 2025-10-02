import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./route.js";
import { globalError } from "./utils/apiError.js";
export const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000", // your frontend origin
    credentials: true,
  })
);

// routes
routes(app);

// middleware to catch exception errors
app.use(globalError);
