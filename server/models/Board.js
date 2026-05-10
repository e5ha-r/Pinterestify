import mongoose from 'mongoose';

const pinEmbedSchema = new mongoose.Schema({
  title:    { type: String, required: true },
  image:    { type: String, required: true },
  category: { type: String, default: 'art' },
  author:   { type: String, default: 'Anonymous' },
  likes:    { type: Number, default: 0 },
  saves:    { type: Number, default: 0 },
  // Spotify song reference (optional)
  spotifyTrackId:   { type: String, default: null },
  spotifyTrackName: { type: String, default: null },
  spotifyArtist:    { type: String, default: null },
  spotifyPreview:   { type: String, default: null },
}, { _id: true, timestamps: true });

const boardSchema = new mongoose.Schema({
  title:    { type: String, required: true, trim: true },
  isPublic: { type: Boolean, default: true },
  accent:   { type: String, default: '#FF5EBA' },
  creator:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pins:     [pinEmbedSchema],
}, { timestamps: true });

export default mongoose.model('Board', boardSchema);
