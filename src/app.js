import express from "express";
import cookieParser from "cookie-parser";
import routes from "./route.js";
import { globalError } from "./utils/apiError.js";
export const app = express();

// middlewares
app.use(express.json());
app.use(cookieParser());

// routes
routes(app);

// middleware to catch exception errors
app.use(globalError);
