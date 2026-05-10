import express from 'express';
import Board from '../models/Board.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// GET /api/boards/public — all public boards (for Explore page)
router.get('/public', async (req, res, next) => {
  try {
    const boards = await Board.find({ isPublic: true })
      .populate('creator', 'username pfp')
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(boards);
  } catch (err) { next(err); }
});

// GET /api/boards — boards for logged-in user
router.get('/', protect, async (req, res, next) => {
  try {
    const boards = await Board.find({ creator: req.user })
      .sort({ createdAt: -1 });
    res.json(boards);
  } catch (err) { next(err); }
});

// GET /api/boards/:id — single board
router.get('/:id', async (req, res, next) => {
  try {
    const board = await Board.findById(req.params.id)
      .populate('creator', 'username pfp');
    if (!board) return res.status(404).json({ message: 'Board not found' });
    res.json(board);
  } catch (err) { next(err); }
});

// POST /api/boards — create board
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, isPublic, accent } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const board = await Board.create({
      title,
      isPublic: isPublic !== undefined ? isPublic : true,
      accent: accent || '#FF5EBA',
      creator: req.user,
      pins: []
    });
    res.status(201).json(board);
  } catch (err) { next(err); }
});

// PUT /api/boards/:id — edit board
router.put('/:id', protect, async (req, res, next) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, creator: req.user });
    if (!board) return res.status(404).json({ message: 'Board not found or unauthorized' });
    const { title, isPublic, accent } = req.body;
    if (title)    board.title    = title;
    if (isPublic !== undefined) board.isPublic = isPublic;
    if (accent)   board.accent   = accent;
    await board.save();
    res.json(board);
  } catch (err) { next(err); }
});

// DELETE /api/boards/:id
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const board = await Board.findOneAndDelete({ _id: req.params.id, creator: req.user });
    if (!board) return res.status(404).json({ message: 'Board not found or unauthorized' });
    res.json({ message: 'Board deleted' });
  } catch (err) { next(err); }
});

// POST /api/boards/:id/pins — add a pin to board
router.post('/:id/pins', protect, async (req, res, next) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, creator: req.user });
    if (!board) return res.status(404).json({ message: 'Board not found or unauthorized' });
    const { title, image, category, author, likes, saves,
            spotifyTrackId, spotifyTrackName, spotifyArtist, spotifyPreview } = req.body;
    board.pins.push({
      title, image,
      category: category || 'art',
      author: author || 'Anonymous',
      likes: likes || 0,
      saves: saves || 0,
      spotifyTrackId, spotifyTrackName, spotifyArtist, spotifyPreview
    });
    await board.save();
    res.json(board);
  } catch (err) { next(err); }
});

// DELETE /api/boards/:id/pins/:pinId — remove a pin from board
router.delete('/:id/pins/:pinId', protect, async (req, res, next) => {
  try {
    const board = await Board.findOne({ _id: req.params.id, creator: req.user });
    if (!board) return res.status(404).json({ message: 'Board not found or unauthorized' });
    board.pins = board.pins.filter(p => p._id.toString() !== req.params.pinId);
    await board.save();
    res.json(board);
  } catch (err) { next(err); }
});

export default router;
