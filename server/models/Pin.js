import mongoose from 'mongoose';

const pinSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  image:    { type: String, required: true },
  category: { type: String, default: 'art' },
  author:   { type: String, default: 'Anonymous' },
  likes:    { type: Number, default: 0 },
  saves:    { type: Number, default: 0 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  // Optional Spotify attachment
  spotifyTrackId:   { type: String, default: null },
  spotifyTrackName: { type: String, default: null },
  spotifyArtist:    { type: String, default: null },
  spotifyPreview:   { type: String, default: null },
}, { timestamps: true });

export default mongoose.model('Pin', pinSchema);
