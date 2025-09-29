import mongoose from "mongoose";

const CardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "" },
  dueDate: Date,
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  list: { type: mongoose.Schema.Types.ObjectId, ref: "List", required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pos: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

CardSchema.index({ board: 1, list: 1, pos: 1 });

export default mongoose.model("Card", CardSchema);
