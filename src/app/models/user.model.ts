import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: { type: String },
  password: { type: String },
  status: { type: Schema.Types.ObjectId },
  verificationToken: { type: String },
});

const userModel = model("user", userSchema);

export default userModel;
