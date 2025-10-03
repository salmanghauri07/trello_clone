import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true, // ✅ usually a good practice for users
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false,
    },
    avatar: {
      type: String, // ✅ will store URL from ui-avatars.com
      default: "", // fallback if no avatar is assigned
    },
    refreshToken: {
      type: [String], // store multiple refresh tokens if needed
      required: false,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    OTP: {
      type: Number,
    },
    otpExpiresAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// ✅ Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// ✅ Compare candidate password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
