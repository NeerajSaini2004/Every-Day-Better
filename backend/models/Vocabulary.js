const mongoose = require('mongoose');

const vocabularySchema = new mongoose.Schema({
  word: { type: String, required: true },
  meaning: { type: String, required: true },
  hindiMeaning: { type: String, required: true },
  pronunciation: { type: String },
  exampleSentence: { type: String },
  dayNumber: { type: Number },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  category: { type: String, default: 'general' },
});

module.exports = mongoose.model('Vocabulary', vocabularySchema);
