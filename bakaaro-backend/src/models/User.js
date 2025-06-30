import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "staff", "cashier"],
      default: "staff",
    },
    branch: { type: String, required: true },
    active: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model("User", userSchema)
