import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
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

    refreshToken: {
      type: [String], // we only need to store the JWT string
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

// to store password after hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

// custom function for decrypting the password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
