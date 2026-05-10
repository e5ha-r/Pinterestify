import express from 'express';
import Pin from '../models/Pin.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/pins — all pins (global feed)
router.get('/', async (req, res, next) => {
  try {
    const { category, search } = req.query;
    let query = {};
    if (category) query.category = category;
    if (search)   query.$or = [
      { title:    { $regex: search, $options: 'i' } },
      { author:   { $regex: search, $options: 'i' } },
      { category: { $regex: search, $options: 'i' } },
    ];
    const pins = await Pin.find(query).sort({ createdAt: -1 }).limit(200);
    res.json(pins);
  } catch (err) { next(err); }
});

// POST /api/pins — create a pin (auth required)
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, image, category, author, spotifyTrackId, spotifyTrackName, spotifyArtist, spotifyPreview } = req.body;
    if (!title || !image) return res.status(400).json({ message: 'Title and image are required' });
    const pin = await Pin.create({
      title, image,
      category: category || 'art',
      author: author || 'Anonymous',
      createdBy: req.user,
      spotifyTrackId, spotifyTrackName, spotifyArtist, spotifyPreview
    });
    res.status(201).json(pin);
  } catch (err) { next(err); }
});

// PUT /api/pins/:id/like
router.put('/:id/like', async (req, res, next) => {
  try {
    const pin = await Pin.findByIdAndUpdate(
      req.params.id, { $inc: { likes: 1 } }, { new: true }
    );
    if (!pin) return res.status(404).json({ message: 'Pin not found' });
    res.json(pin);
  } catch (err) { next(err); }
});

// DELETE /api/pins/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const pin = await Pin.findOneAndDelete({ _id: req.params.id, createdBy: req.user });
    if (!pin) return res.status(404).json({ message: 'Pin not found or unauthorized' });
    res.json({ message: 'Pin deleted' });
  } catch (err) { next(err); }
});

export default router;
