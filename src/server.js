import connectDB from "./config/db.js";

import { app } from "./app.js";

async function startServer() {
  try {
    await connectDB();

    app.listen(5000, () => {
      console.log("🚀 Server running on http://localhost:5000");
    });
  } catch (err) {
    console.error("❌ Failed to connect to DB:", err);
    process.exit(1); // stop app
  }
}

startServer();
