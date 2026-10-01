const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  type: { type: String, enum: ['speaking', 'listening', 'reading', 'vocabulary', 'grammar', 'confidence'], required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  xp: { type: Number, default: 10 },
  duration: { type: Number, default: 5 }, // minutes
  hasTimer: { type: Boolean, default: false },
  hasRecording: { type: Boolean, default: false },
  url: { type: String, trim: true },
  urlLabel: { type: String, trim: true },
});

const daySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  tasks: [taskSchema],
  totalXP: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  weekNumber: { type: Number },
  theme: { type: String },
});

module.exports = mongoose.model('Day', daySchema);
