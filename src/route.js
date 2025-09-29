import userRoute from "./routes/userRoute.js";

export default function routes(app) {
  app.use("/api/user", userRoute);
}
