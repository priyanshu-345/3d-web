import mongoose from 'mongoose';

const designSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  modelUrl: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['living-room', 'bedroom', 'kitchen', 'bathroom', 'office', 'other'],
    default: 'other',
  },
  price: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Design', designSchema);










