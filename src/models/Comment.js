import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  card: { type: mongoose.Schema.Types.ObjectId, ref: "Card", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

CommentSchema.index({ card: 1 });

export default mongoose.model("Comment", CommentSchema);
