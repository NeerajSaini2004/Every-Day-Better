// backend/seed/seedVocabulary.js
// Run this with: node seed/seedVocabulary.js

const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Vocabulary = require('../models/Vocabulary');
const Quote = require('../models/Quote');

// Comprehensive vocabulary data
const vocabularyData = [
  // BEGINNER - Day 1-20
  // Common daily words
  { word: 'Hello', meaning: 'Greeting used to say hi', hindiMeaning: 'नमस्ते', pronunciation: 'hə-ˈlō', dayNumber: 1, difficulty: 'beginner', category: 'greetings', exampleSentence: 'Hello! How are you today?' },
  { word: 'Thank you', meaning: 'Expression of gratitude', hindiMeaning: 'धन्यवाद', pronunciation: 'thangk yu', dayNumber: 1, difficulty: 'beginner', category: 'greetings', exampleSentence: 'Thank you for helping me!' },
  { word: 'Please', meaning: 'Polite request word', hindiMeaning: 'कृपया', pronunciation: 'plēz', dayNumber: 1, difficulty: 'beginner', category: 'greetings', exampleSentence: 'Please sit down.' },
  { word: 'Sorry', meaning: 'Expression of regret/apology', hindiMeaning: 'माफ़ी', pronunciation: 'ˈsär-ē', dayNumber: 2, difficulty: 'beginner', category: 'greetings', exampleSentence: 'Sorry for being late!' },
  
  // Family
  { word: 'Family', meaning: 'Group of related people living together', hindiMeaning: 'परिवार', pronunciation: 'ˈfam-lē', dayNumber: 3, difficulty: 'beginner', category: 'family', exampleSentence: 'My family lives in Delhi.' },
  { word: 'Mother', meaning: 'Female parent', hindiMeaning: 'माँ', pronunciation: 'ˈmu-thər', dayNumber: 3, difficulty: 'beginner', category: 'family', exampleSentence: 'My mother is a teacher.' },
  { word: 'Father', meaning: 'Male parent', hindiMeaning: 'पिता', pronunciation: 'ˈfä-thər', dayNumber: 3, difficulty: 'beginner', category: 'family', exampleSentence: 'My father works in IT.' },
  { word: 'Brother', meaning: 'Male sibling', hindiMeaning: 'भाई', pronunciation: 'ˈbru-thər', dayNumber: 3, difficulty: 'beginner', category: 'family', exampleSentence: 'My brother is in college.' },
  { word: 'Sister', meaning: 'Female sibling', hindiMeaning: 'बहन', pronunciation: 'ˈsis-tər', dayNumber: 3, difficulty: 'beginner', category: 'family', exampleSentence: 'My sister likes to read books.' },
  
  // School & Education
  { word: 'School', meaning: 'Place where students learn', hindiMeaning: 'स्कूल', pronunciation: 'skül', dayNumber: 4, difficulty: 'beginner', category: 'education', exampleSentence: 'I go to school every weekday.' },
  { word: 'Teacher', meaning: 'Person who teaches students', hindiMeaning: 'शिक्षक', pronunciation: 'ˈtē-chər', dayNumber: 4, difficulty: 'beginner', category: 'education', exampleSentence: 'My teacher is very kind.' },
  { word: 'Student', meaning: 'Person who studies in school', hindiMeaning: 'छात्र', pronunciation: 'ˈstü-dənt', dayNumber: 4, difficulty: 'beginner', category: 'education', exampleSentence: 'I am a student of economics.' },
  { word: 'Book', meaning: 'Written work bound as pages', hindiMeaning: 'किताब', pronunciation: 'bu̇k', dayNumber: 4, difficulty: 'beginner', category: 'education', exampleSentence: 'This book is very interesting.' },
  { word: 'Pen', meaning: 'Writing instrument with ink', hindiMeaning: 'कलम', pronunciation: 'pen', dayNumber: 4, difficulty: 'beginner', category: 'education', exampleSentence: 'I need a blue pen to write.' },
  
  // Colors
  { word: 'Red', meaning: 'Color of blood/fire', hindiMeaning: 'लाल', pronunciation: 'red', dayNumber: 5, difficulty: 'beginner', category: 'colors', exampleSentence: 'She is wearing a red dress.' },
  { word: 'Blue', meaning: 'Color of sky/ocean', hindiMeaning: 'नीला', pronunciation: 'blü', dayNumber: 5, difficulty: 'beginner', category: 'colors', exampleSentence: 'The sky is blue and beautiful.' },
  { word: 'Green', meaning: 'Color of grass/trees', hindiMeaning: 'हरा', pronunciation: 'grēn', dayNumber: 5, difficulty: 'beginner', category: 'colors', exampleSentence: 'I like green vegetables.' },
  { word: 'Yellow', meaning: 'Color of sun/gold', hindiMeaning: 'पीला', pronunciation: 'ˈyel-ō', dayNumber: 5, difficulty: 'beginner', category: 'colors', exampleSentence: 'The sun is yellow and bright.' },
  
  // Numbers
  { word: 'One', meaning: 'Number 1', hindiMeaning: 'एक', pronunciation: 'wən', dayNumber: 6, difficulty: 'beginner', category: 'numbers', exampleSentence: 'I have one book.' },
  { word: 'Two', meaning: 'Number 2', hindiMeaning: 'दो', pronunciation: 'tü', dayNumber: 6, difficulty: 'beginner', category: 'numbers', exampleSentence: 'I have two pen.' },
  { word: 'Three', meaning: 'Number 3', hindiMeaning: 'तीन', pronunciation: 'thrē', dayNumber: 6, difficulty: 'beginner', category: 'numbers', exampleSentence: 'There are three students here.' },
  { word: 'Ten', meaning: 'Number 10', hindiMeaning: 'दस', pronunciation: 'ten', dayNumber: 6, difficulty: 'beginner', category: 'numbers', exampleSentence: 'I have ten fingers.' },
  
  // Food
  { word: 'Food', meaning: 'Substance consumed for nutrition', hindiMeaning: 'खाना', pronunciation: 'füd', dayNumber: 7, difficulty: 'beginner', category: 'food', exampleSentence: 'Indian food is very tasty.' },
  { word: 'Water', meaning: 'Clear liquid essential for life', hindiMeaning: 'पानी', pronunciation: 'ˈwȯ-tər', dayNumber: 7, difficulty: 'beginner', category: 'food', exampleSentence: 'Please give me a glass of water.' },
  { word: 'Rice', meaning: 'Staple grain food', hindiMeaning: 'चावल', pronunciation: 'rīs', dayNumber: 7, difficulty: 'beginner', category: 'food', exampleSentence: 'Rice is my favorite food.' },
  { word: 'Bread', meaning: 'Baked grain product', hindiMeaning: 'रोटी/ब्रेड', pronunciation: 'bred', dayNumber: 7, difficulty: 'beginner', category: 'food', exampleSentence: 'I eat bread for breakfast.' },
  
  // INTERMEDIATE - Day 21-40
  // Emotions
  { word: 'Happy', meaning: 'Feeling of joy and pleasure', hindiMeaning: 'खुश', pronunciation: 'ˈha-pē', dayNumber: 21, difficulty: 'intermediate', category: 'emotions', exampleSentence: 'I am happy to see you.' },
  { word: 'Sad', meaning: 'Feeling of sorrow or unhappiness', hindiMeaning: 'दुखी', pronunciation: 'sad', dayNumber: 21, difficulty: 'intermediate', category: 'emotions', exampleSentence: 'She looks sad today.' },
  { word: 'Angry', meaning: 'Feeling of rage or fury', hindiMeaning: 'क्रोधित', pronunciation: 'ˈaŋ-grē', dayNumber: 21, difficulty: 'intermediate', category: 'emotions', exampleSentence: 'Don\'t be angry with me.' },
  { word: 'Excited', meaning: 'Feeling of great enthusiasm', hindiMeaning: 'उत्साहित', pronunciation: 'ik-ˈsī-təd', dayNumber: 21, difficulty: 'intermediate', category: 'emotions', exampleSentence: 'I am excited about the trip.' },
  { word: 'Nervous', meaning: 'Feeling of anxiety or worry', hindiMeaning: 'घबराया', pronunciation: 'ˈnər-vəs', dayNumber: 21, difficulty: 'intermediate', category: 'emotions', exampleSentence: 'I am nervous about the exam.' },
  
  // Professions
  { word: 'Doctor', meaning: 'Medical professional who treats patients', hindiMeaning: 'डॉक्टर', pronunciation: 'ˈdäk-tər', dayNumber: 22, difficulty: 'intermediate', category: 'work', exampleSentence: 'My uncle is a doctor.' },
  { word: 'Engineer', meaning: 'Professional who designs structures/machines', hindiMeaning: 'इंजीनियर', pronunciation: 'en-jə-ˈnir', dayNumber: 22, difficulty: 'intermediate', category: 'work', exampleSentence: 'She is a software engineer.' },
  { word: 'Nurse', meaning: 'Person who cares for sick patients', hindiMeaning: 'नर्स', pronunciation: 'nərs', dayNumber: 22, difficulty: 'intermediate', category: 'work', exampleSentence: 'The nurse was very helpful.' },
  { word: 'Lawyer', meaning: 'Legal professional who practices law', hindiMeaning: 'वकील', pronunciation: 'ˈlȯ-yər', dayNumber: 22, difficulty: 'intermediate', category: 'work', exampleSentence: 'My brother is a lawyer.' },
  { word: 'Manager', meaning: 'Person responsible for organizing team', hindiMeaning: 'प्रबंधक', pronunciation: 'ˈma-nij-ər', dayNumber: 22, difficulty: 'intermediate', category: 'work', exampleSentence: 'I work with my manager.' },
  
  // Travel
  { word: 'Journey', meaning: 'Act of traveling from one place to another', hindiMeaning: 'यात्रा', pronunciation: 'ˈjər-nē', dayNumber: 23, difficulty: 'intermediate', category: 'travel', exampleSentence: 'The journey was long but fun.' },
  { word: 'Airport', meaning: 'Place where airplanes take off and land', hindiMeaning: 'हवाई अड्डा', pronunciation: 'ˈer-ˌpȯrt', dayNumber: 23, difficulty: 'intermediate', category: 'travel', exampleSentence: 'I went to the airport early.' },
  { word: 'Hotel', meaning: 'Building with rooms for temporary stay', hindiMeaning: 'होटल', pronunciation: 'hō-ˈtel', dayNumber: 23, difficulty: 'intermediate', category: 'travel', exampleSentence: 'The hotel was very comfortable.' },
  { word: 'Tourist', meaning: 'Person traveling for pleasure', hindiMeaning: 'पर्यटक', pronunciation: 'ˈtu̇r-ist', dayNumber: 23, difficulty: 'intermediate', category: 'travel', exampleSentence: 'Many tourists visit India.' },
  
  // ADVANCED - Day 41-60
  // Abstract Concepts
  { word: 'Eloquent', meaning: 'Fluent and persuasive in speaking/writing', hindiMeaning: 'वाचाल/प्रभावशाली', pronunciation: 'ˈe-kwə-wənt', dayNumber: 41, difficulty: 'advanced', category: 'abstract', exampleSentence: 'He gave an eloquent speech.' },
  { word: 'Meticulous', meaning: 'Showing great attention to detail', hindiMeaning: 'सूक्ष्म/विस्तृत', pronunciation: 'mə-ˈti-kyə-ləs', dayNumber: 41, difficulty: 'advanced', category: 'abstract', exampleSentence: 'She is meticulous in her work.' },
  { word: 'Pragmatic', meaning: 'Dealing with things in a practical way', hindiMeaning: 'व्यावहारिक', pronunciation: 'prag-ˈma-tik', dayNumber: 41, difficulty: 'advanced', category: 'abstract', exampleSentence: 'He has a pragmatic approach.' },
  { word: 'Resilient', meaning: 'Able to recover quickly from difficulties', hindiMeaning: 'लचीला', pronunciation: 'ri-ˈzil-yənt', dayNumber: 41, difficulty: 'advanced', category: 'abstract', exampleSentence: 'She is a resilient person.' },
  { word: 'Ambiguous', meaning: 'Having more than one possible meaning', hindiMeaning: 'अस्पष्ट', pronunciation: 'am-ˈbig-yə-wəs', dayNumber: 41, difficulty: 'advanced', category: 'abstract', exampleSentence: 'The statement is ambiguous.' },
];

// Motivational quotes
const quotesData = [
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs', category: 'motivation' },
  { text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson', category: 'motivation' },
  { text: 'Success is not final, failure is not fatal.', author: 'Winston Churchill', category: 'motivation' },
  { text: 'You miss 100% of the shots you don\'t take.', author: 'Wayne Gretzky', category: 'motivation' },
  { text: 'The best time to plant a tree was 20 years ago. The second best is now.', author: 'Chinese Proverb', category: 'motivation' },
  { text: 'Innovation distinguishes between a leader and a follower.', author: 'Steve Jobs', category: 'motivation' },
  { text: 'Life is 10% what happens to you and 90% how you react.', author: 'Charles R. Swindoll', category: 'motivation' },
  { text: 'The future belongs to those who believe in the beauty of their dreams.', author: 'Eleanor Roosevelt', category: 'motivation' },
  { text: 'It is during our darkest moments that we must focus to see the light.', author: 'Aristotle', category: 'motivation' },
  { text: 'The only impossible journey is the one you never begin.', author: 'Tony Robbins', category: 'motivation' },
  { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt', category: 'motivation' },
  { text: 'What lies behind us and what lies before us are tiny matters compared to what lies within us.', author: 'Ralph Waldo Emerson', category: 'motivation' },
  { text: 'Your limitation—it\'s only your imagination.', author: 'Unknown', category: 'motivation' },
  { text: 'Great things never come from comfort zones.', author: 'Unknown', category: 'motivation' },
  { text: 'Dream it. Believe it. Build it.', author: 'Unknown', category: 'motivation' },
  { text: 'Don\'t stop when you\'re tired, stop when you\'re done.', author: 'Unknown', category: 'motivation' },
  { text: 'Wake up with determination, go to bed with satisfaction.', author: 'Unknown', category: 'motivation' },
  { text: 'Do something today that your future self will thank you for.', author: 'Unknown', category: 'motivation' },
  { text: 'Little things make big days.', author: 'Unknown', category: 'motivation' },
  { text: 'It\'s going to be hard, but hard does not mean impossible.', author: 'Unknown', category: 'motivation' },
  // Hindi-focused quotes
  { text: 'अभ्यास ही सिद्धि की कुंजी है।', author: 'भारतीय कहावत', category: 'motivation' },
  { text: 'एक बूंद से ही समुद्र बनता है।', author: 'भारतीय कहावत', category: 'motivation' },
  { text: 'जहां चाह वहां राह।', author: 'भारतीय कहावत', category: 'motivation' },
  { text: 'सीखना जीवन भर चलने वाली यात्रा है।', author: 'भारतीय कहावत', category: 'motivation' },
  { text: 'आपका सपना आपकी शक्ति है।', author: 'भारतीय कहावत', category: 'motivation' },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected ✅');

    // Clear existing data
    await Vocabulary.deleteMany({});
    await Quote.deleteMany({});
    console.log('Cleared existing data ✅');

    // Insert vocabulary
    const vocabResult = await Vocabulary.insertMany(vocabularyData);
    console.log(`✅ Inserted ${vocabResult.length} vocabulary words`);

    // Insert quotes
    const quotesResult = await Quote.insertMany(quotesData);
    console.log(`✅ Inserted ${quotesResult.length} motivational quotes`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`Total words: ${vocabularyData.length}`);
    console.log(`Total quotes: ${quotesData.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
