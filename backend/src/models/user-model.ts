import mongoose, { type Document } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  googleId?: string;
  password?: string;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetToken?: string;
  resetTokenExpiry?: string;
  isVerified: boolean;
  role: "admin" | "user";

  comparePasswords(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: [true, "First name not provided"],
  },
  email: {
    type: String,
    required: [true, "Email not provided"],
    unique: [true, "Email already in use"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
  },
  verificationToken: {
    type: String,
  },
  verificationTokenExpiry: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  resetToken: {
    type: String,
  },
  resetTokenExpiry: {
    type: String,
  },
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
});

userSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password") && this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.comparePasswords = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  const isAMatch = await bcrypt.compare(candidatePassword, this.password);
  return isAMatch;
};

const Users = new mongoose.Model("User", userSchema);
export default Users;
