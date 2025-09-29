import Company from "../models/Company.js";
import connectDB from "../config/db.js";
const data = {
  name: "InvexTech",
};

async function addData() {
  await connectDB();

  // Clear existing roles (optional)
  await Company.deleteMany({});
  console.log("Old roles cleared");

  // Insert new roles
  await Company.insertMany(data);
  console.log("Roles seeded successfully ✅");
}

addData();
