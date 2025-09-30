// seedPermissions.js
import connectDB from "../config/db.js";
import Permission from "../models/Permission.js";

const permissions = [
  { name: "editor", canEdit: true },
  { name: "viewer", canEdit: false },
];

async function seedPermissions() {
  try {
    await connectDB();

    await Permission.deleteMany({});
    console.log("Old permissions cleared");

    await Permission.insertMany(permissions);
    console.log("Permissions seeded successfully ✅");

    process.exit();
  } catch (err) {
    console.error("Error seeding permissions:", err);
    process.exit(1);
  }
}

seedPermissions();
