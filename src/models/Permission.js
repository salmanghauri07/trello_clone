// models/Permission.js
import mongoose from "mongoose";

const PermissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      enum: ["editor", "viewer"],
      required: true,
      unique: true,
    },
    canEdit: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Permission", PermissionSchema);
