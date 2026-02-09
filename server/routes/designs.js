import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Design from '../models/Design.js';
import { authenticateToken } from '../middleware/auth.js';
import { deleteFile } from '../utils/fileHelper.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|glb|gltf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and 3D models are allowed.'));
    }
  },
});

// Get all designs (public)
router.get('/', async (req, res) => {
  try {
    const designs = await Design.find().sort({ createdAt: -1 });
    res.json(designs);
  } catch (error) {
    console.error('Get designs error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single design (public)
router.get('/:id', async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }
    res.json(design);
  } catch (error) {
    console.error('Get design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create design (protected)
router.post('/', authenticateToken, upload.fields([
  { name: 'model', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]), async (req, res) => {
  try {
    const { title, description, category, price, featured } = req.body;

    if (!req.files || !req.files.model || !req.files.thumbnail) {
      return res.status(400).json({ message: 'Model and thumbnail files are required' });
    }

    const modelUrl = `/uploads/${req.files.model[0].filename}`;
    const thumbnailUrl = `/uploads/${req.files.thumbnail[0].filename}`;

    const design = new Design({
      title,
      description,
      modelUrl,
      thumbnailUrl,
      category: category || 'other',
      price: price || 0,
      featured: featured === 'true',
    });

    await design.save();
    res.status(201).json(design);
  } catch (error) {
    console.error('Create design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update design (protected)
router.put('/:id', authenticateToken, upload.fields([
  { name: 'model', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 },
]), async (req, res) => {
  try {
    const { title, description, category, price, featured } = req.body;
    const design = await Design.findById(req.params.id);

    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    if (title) design.title = title;
    if (description !== undefined) design.description = description;
    if (category) design.category = category;
    if (price !== undefined) design.price = price;
    if (featured !== undefined) design.featured = featured === 'true';

    if (req.files?.model) {
      design.modelUrl = `/uploads/${req.files.model[0].filename}`;
    }
    if (req.files?.thumbnail) {
      design.thumbnailUrl = `/uploads/${req.files.thumbnail[0].filename}`;
    }

    await design.save();
    res.json(design);
  } catch (error) {
    console.error('Update design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete design (protected)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Delete files from uploads folder
    if (design.modelUrl) {
      const modelFileName = design.modelUrl.replace('/uploads/', '');
      deleteFile(modelFileName);
    }
    if (design.thumbnailUrl) {
      const thumbnailFileName = design.thumbnailUrl.replace('/uploads/', '');
      deleteFile(thumbnailFileName);
    }

    await Design.findByIdAndDelete(req.params.id);
    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    console.error('Delete design error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;


