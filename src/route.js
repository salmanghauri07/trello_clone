import userRoute from "./routes/userRoute.js";
import boardRoute from "./routes/boardRoute.js";

export default function routes(app) {
  app.use("/api/user", userRoute);

  app.use("/board", boardRoute);
}
