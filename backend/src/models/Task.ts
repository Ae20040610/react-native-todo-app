import { Schema, model } from 'mongoose';

// A task belongs to exactly one user (the `user` field).
const taskSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    dateTime: { type: Date, required: true }, // when the task is scheduled
    deadline: { type: Date, required: true }, // when it must be finished
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    category: { type: String, default: 'Personal', trim: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default model('Task', taskSchema);
