const mongoose = require('mongoose');

const taskProgressSchema = new mongoose.Schema({
  taskId: { type: mongoose.Schema.Types.ObjectId },
  taskType: String,
  completed: { type: Boolean, default: false },
  completedAt: Date,
  xpEarned: { type: Number, default: 0 },
});

const progressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    day: { type: mongoose.Schema.Types.ObjectId, ref: 'Day', required: true },
    dayNumber: { type: Number, required: true },
    tasks: [taskProgressSchema],
    completionPercentage: { type: Number, default: 0 },
    totalXPEarned: { type: Number, default: 0 },
    isCompleted: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
  },
  { timestamps: true }
);

progressSchema.index({ user: 1, day: 1 }, { unique: true });

module.exports = mongoose.model('Progress', progressSchema);
