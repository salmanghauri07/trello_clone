import mongoose from "mongoose";

const ListSchema = new mongoose.Schema({
  title: { type: String, required: true },
  board: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
  pos: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("List", ListSchema);
