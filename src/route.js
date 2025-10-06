import userRoute from "./routes/userRoute.js";
import boardRoute from "./routes/boardRoute.js";
import listRoute from "./routes/listRoute.js";

export default function routes(app) {
  app.use("/api/user", userRoute);

  app.use("/board", boardRoute);
  app.use("/list", listRoute);
}
