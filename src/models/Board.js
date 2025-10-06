import mongoose from "mongoose";

const BoardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  members: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: { type: String, enum: ["editor", "viewer"] },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

BoardSchema.index({ company: 1 });

export default mongoose.model("Board", BoardSchema);
