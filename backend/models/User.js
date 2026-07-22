const mongoose = require('mongoose');

const srsWordSchema = new mongoose.Schema({
  wordId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vocabulary' },
  nextReview: { type: Date, default: Date.now },
  interval: { type: Number, default: 1 },
  easeFactor: { type: Number, default: 2.5 },
  repetitions: { type: Number, default: 0 },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email address'],
    },
    password: { type: String },
    avatar: { type: String, default: '' },
    googleId: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    xp: { type: Number, default: 0 },
    level: { type: Number, default: 1 },
    streak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastActiveDate: { type: Date },
    completedDays: [{ type: Number }],
    badges: [{ type: String }],
    totalTasksCompleted: { type: Number, default: 0 },
    joinedAt: { type: Date, default: Date.now },
    // Password reset
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
    // Onboarding
    onboardingDone: { type: Boolean, default: false },
    englishLevel: { type: String, enum: ['beginner', 'basic', 'intermediate'], default: 'beginner' },
    goal: { type: String, enum: ['job', 'exam', 'speaking', 'general'], default: 'general' },
    dailyTime: { type: Number, default: 30 },
    // Spaced Repetition
    srsWords: [srsWordSchema],
    // Daily challenge
    lastChallengeDate: { type: Date },
    challengeStreak: { type: Number, default: 0 },
    totalChallengesCompleted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Compound index for leaderboard query
userSchema.index({ xp: -1, role: 1 });
// Index for streak/lastActiveDate queries
userSchema.index({ lastActiveDate: 1 });

module.exports = mongoose.model('User', userSchema);
