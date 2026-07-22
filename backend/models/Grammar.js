const mongoose = require('mongoose');

const grammarSchema = new mongoose.Schema({
  title: { type: String, required: true },
  rule: { type: String, required: true },
  hindiRule: { type: String, required: true },
  examples: [String],
  exampleSentence: { type: String },
  hindiExample: { type: String },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  category: { type: String, required: true },
  dayNumber: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Grammar', grammarSchema);
