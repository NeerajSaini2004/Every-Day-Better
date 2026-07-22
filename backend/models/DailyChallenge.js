const mongoose = require('mongoose');

const dailyChallengeSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctIndex: { type: Number, required: true },
  explanation: { type: String },
  hindiExplanation: { type: String },
  category: { type: String, enum: ['grammar', 'vocabulary', 'tense', 'preposition', 'idiom'], default: 'grammar' },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  dayNumber: { type: Number },
});

module.exports = mongoose.model('DailyChallenge', dailyChallengeSchema);
