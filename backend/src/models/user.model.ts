import mongoose, { Schema } from 'mongoose';
import { User } from '../types/types';

const userSchema: Schema = new Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 6
  },
  role: {
    type: String,
    required: true,
    default: 'user'
  },
  profilePicture: {
    type: String,
    required: false,
  }
}, { timestamps: true});

export default mongoose.model<User>('User', userSchema);