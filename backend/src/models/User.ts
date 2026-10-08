import { Schema, model } from 'mongoose';

// A registered user. `password` stores a bcrypt hash, never plain text.
const userSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

export default model('User', userSchema);
