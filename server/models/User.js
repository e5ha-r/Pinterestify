import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  pfp: {
    type: String,
    default: "https://api.dicebear.com/9.x/notionists/svg?seed=Luna&backgroundColor=b6e3f4"
  },
  spotifyId:      { type: String, default: null },
  spotifyToken:   { type: String, default: null },
  spotifyRefresh: { type: String, default: null },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
