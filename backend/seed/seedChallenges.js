require('dotenv').config();
const mongoose = require('mongoose');
const DailyChallenge = require('../models/DailyChallenge');

const challenges = [
  // GRAMMAR
  {
    question: 'Which sentence is grammatically correct?',
    options: ['She don\'t like coffee.', 'She doesn\'t like coffee.', 'She not like coffee.', 'She isn\'t like coffee.'],
    correctIndex: 1,
    explanation: 'With third-person singular (she/he/it), we use "doesn\'t" in negative sentences.',
    hindiExplanation: 'She/He/It के साथ negative में "doesn\'t" use होता है।',
    category: 'grammar', difficulty: 'beginner',
  },
  {
    question: 'Choose the correct sentence:',
    options: ['I am go to school.', 'I goes to school.', 'I go to school.', 'I going to school.'],
    correctIndex: 2,
    explanation: '"I go" is correct. With "I", we use the base form of the verb in simple present.',
    hindiExplanation: '"I" के साथ simple present में verb की base form use होती है।',
    category: 'grammar', difficulty: 'beginner',
  },
  {
    question: 'Fill in the blank: "They _____ playing cricket right now."',
    options: ['is', 'are', 'was', 'were'],
    correctIndex: 1,
    explanation: '"They" is plural, so we use "are" with present continuous tense.',
    hindiExplanation: '"They" plural है, इसलिए "are" use होता है।',
    category: 'grammar', difficulty: 'beginner',
  },
  {
    question: 'Which is the correct past tense of "go"?',
    options: ['goed', 'gone', 'went', 'goes'],
    correctIndex: 2,
    explanation: '"Went" is the simple past tense of "go". It is an irregular verb.',
    hindiExplanation: '"Go" का past tense "went" है — यह irregular verb है।',
    category: 'grammar', difficulty: 'beginner',
  },
  {
    question: 'Choose the correct question form: "_____ she speak English?"',
    options: ['Do', 'Does', 'Is', 'Are'],
    correctIndex: 1,
    explanation: 'With she/he/it in simple present questions, we use "Does".',
    hindiExplanation: 'She/He/It के साथ question में "Does" use होता है।',
    category: 'grammar', difficulty: 'beginner',
  },
  {
    question: 'Which sentence uses the present perfect correctly?',
    options: ['I have went there.', 'I have go there.', 'I have been there.', 'I has been there.'],
    correctIndex: 2,
    explanation: '"Have been" is the correct present perfect form. "Been" is the past participle of "be/go".',
    hindiExplanation: 'Present perfect में "have/has + past participle" use होता है।',
    category: 'grammar', difficulty: 'intermediate',
  },
  {
    question: 'Fill in the blank: "If I _____ rich, I would travel the world."',
    options: ['am', 'was', 'were', 'be'],
    correctIndex: 2,
    explanation: 'In second conditional (imaginary situations), we use "were" for all subjects.',
    hindiExplanation: 'Second conditional में "were" use होता है — चाहे subject कोई भी हो।',
    category: 'grammar', difficulty: 'intermediate',
  },

  // TENSE
  {
    question: 'Which tense is used in: "She has been studying for 3 hours."?',
    options: ['Simple Present', 'Present Perfect', 'Present Perfect Continuous', 'Past Continuous'],
    correctIndex: 2,
    explanation: '"Has been studying" = Present Perfect Continuous — an action that started in the past and is still continuing.',
    hindiExplanation: 'यह Present Perfect Continuous है — काम past में शुरू हुआ और अभी भी चल रहा है।',
    category: 'tense', difficulty: 'intermediate',
  },
  {
    question: 'Fill in the blank: "I _____ my homework before dinner yesterday."',
    options: ['finish', 'finished', 'had finished', 'have finished'],
    correctIndex: 2,
    explanation: '"Had finished" (Past Perfect) is used when one past action happened before another past action.',
    hindiExplanation: 'Past Perfect तब use होता है जब एक past action दूसरे से पहले हुई हो।',
    category: 'tense', difficulty: 'intermediate',
  },
  {
    question: 'Which sentence is in simple future tense?',
    options: ['I am going to the market.', 'I went to the market.', 'I will go to the market.', 'I have gone to the market.'],
    correctIndex: 2,
    explanation: '"Will + base verb" forms the simple future tense.',
    hindiExplanation: '"Will + verb" से simple future tense बनता है।',
    category: 'tense', difficulty: 'beginner',
  },
  {
    question: '"When I arrived, she _____ cooking." — Choose the correct form:',
    options: ['is', 'was', 'were', 'has been'],
    correctIndex: 1,
    explanation: 'Past continuous "was cooking" describes an action in progress when another past action happened.',
    hindiExplanation: 'Past continuous — जब एक action चल रही थी और दूसरी हुई।',
    category: 'tense', difficulty: 'intermediate',
  },

  // VOCABULARY
  {
    question: 'What does "eloquent" mean?',
    options: ['Angry and loud', 'Fluent and persuasive in speech', 'Shy and quiet', 'Confused and unclear'],
    correctIndex: 1,
    explanation: '"Eloquent" means expressing yourself clearly and persuasively. Example: "She gave an eloquent speech."',
    hindiExplanation: '"Eloquent" का मतलब है — प्रभावशाली और स्पष्ट रूप से बोलने वाला।',
    category: 'vocabulary', difficulty: 'intermediate',
  },
  {
    question: 'Choose the correct meaning of "persevere":',
    options: ['To give up easily', 'To continue despite difficulty', 'To speak loudly', 'To forget quickly'],
    correctIndex: 1,
    explanation: '"Persevere" means to keep going despite challenges. Example: "She persevered through all difficulties."',
    hindiExplanation: '"Persevere" का मतलब है — मुश्किलों के बावजूद लगे रहना।',
    category: 'vocabulary', difficulty: 'intermediate',
  },
  {
    question: 'What is the meaning of "ambiguous"?',
    options: ['Very clear and obvious', 'Having more than one possible meaning', 'Extremely confident', 'Completely wrong'],
    correctIndex: 1,
    explanation: '"Ambiguous" means unclear or having multiple interpretations. Example: "His answer was ambiguous."',
    hindiExplanation: '"Ambiguous" का मतलब है — जिसके एक से ज़्यादा अर्थ हों।',
    category: 'vocabulary', difficulty: 'advanced',
  },
  {
    question: 'Which word means "to make something better"?',
    options: ['Deteriorate', 'Improve', 'Ignore', 'Complicate'],
    correctIndex: 1,
    explanation: '"Improve" means to make something better or of higher quality.',
    hindiExplanation: '"Improve" का मतलब है — बेहतर बनाना।',
    category: 'vocabulary', difficulty: 'beginner',
  },
  {
    question: 'What does "diligent" mean?',
    options: ['Lazy and careless', 'Hardworking and careful', 'Rude and aggressive', 'Slow and confused'],
    correctIndex: 1,
    explanation: '"Diligent" means showing care and effort in your work. Example: "She is a diligent student."',
    hindiExplanation: '"Diligent" का मतलब है — मेहनती और सावधान।',
    category: 'vocabulary', difficulty: 'intermediate',
  },
  {
    question: 'Choose the synonym of "courageous":',
    options: ['Fearful', 'Brave', 'Weak', 'Confused'],
    correctIndex: 1,
    explanation: '"Courageous" and "brave" both mean having the ability to face fear or danger.',
    hindiExplanation: '"Courageous" और "brave" दोनों का मतलब है — साहसी।',
    category: 'vocabulary', difficulty: 'beginner',
  },

  // PREPOSITION
  {
    question: 'Fill in the blank: "She arrived _____ Monday morning."',
    options: ['in', 'on', 'at', 'by'],
    correctIndex: 1,
    explanation: 'We use "on" with days of the week. "On Monday", "on Friday", etc.',
    hindiExplanation: 'Days of the week के साथ "on" use होता है।',
    category: 'preposition', difficulty: 'beginner',
  },
  {
    question: 'Choose the correct preposition: "The keys are _____ the table."',
    options: ['in', 'on', 'at', 'under'],
    correctIndex: 1,
    explanation: '"On" is used for surfaces. The keys are resting on the surface of the table.',
    hindiExplanation: 'Surface पर रखी चीज़ों के लिए "on" use होता है।',
    category: 'preposition', difficulty: 'beginner',
  },
  {
    question: 'Fill in the blank: "I will meet you _____ 5 o\'clock."',
    options: ['in', 'on', 'at', 'by'],
    correctIndex: 2,
    explanation: 'We use "at" with specific times. "At 5 o\'clock", "at noon", "at midnight".',
    hindiExplanation: 'Specific time के साथ "at" use होता है।',
    category: 'preposition', difficulty: 'beginner',
  },
  {
    question: '"She has been working here _____ 2020." — Choose the correct preposition:',
    options: ['for', 'since', 'from', 'during'],
    correctIndex: 1,
    explanation: '"Since" is used with a specific point in time (2020, Monday, January). "For" is used with a duration.',
    hindiExplanation: 'Specific time point के साथ "since" और duration के साथ "for" use होता है।',
    category: 'preposition', difficulty: 'intermediate',
  },
  {
    question: 'Choose the correct sentence:',
    options: ['I am interested on cricket.', 'I am interested in cricket.', 'I am interested at cricket.', 'I am interested by cricket.'],
    correctIndex: 1,
    explanation: '"Interested in" is the correct collocation. We are always interested IN something.',
    hindiExplanation: '"Interested" के साथ हमेशा "in" use होता है।',
    category: 'preposition', difficulty: 'beginner',
  },

  // IDIOM
  {
    question: 'What does "break the ice" mean?',
    options: ['To break something made of ice', 'To start a conversation in an awkward situation', 'To feel very cold', 'To stop a fight'],
    correctIndex: 1,
    explanation: '"Break the ice" means to do or say something to make people feel more comfortable in a new situation.',
    hindiExplanation: '"Break the ice" का मतलब है — awkward situation में बातचीत शुरू करना।',
    category: 'idiom', difficulty: 'intermediate',
  },
  {
    question: 'What does "hit the books" mean?',
    options: ['To throw books', 'To study hard', 'To buy new books', 'To close a book'],
    correctIndex: 1,
    explanation: '"Hit the books" is an idiom meaning to study seriously.',
    hindiExplanation: '"Hit the books" का मतलब है — ज़ोर से पढ़ाई करना।',
    category: 'idiom', difficulty: 'beginner',
  },
  {
    question: 'What does "under the weather" mean?',
    options: ['Standing in the rain', 'Feeling slightly ill', 'Being very happy', 'Working outdoors'],
    correctIndex: 1,
    explanation: '"Under the weather" means feeling sick or unwell.',
    hindiExplanation: '"Under the weather" का मतलब है — थोड़ा बीमार महसूस करना।',
    category: 'idiom', difficulty: 'beginner',
  },
  {
    question: 'What does "once in a blue moon" mean?',
    options: ['Every night', 'Very rarely', 'During full moon', 'Every month'],
    correctIndex: 1,
    explanation: '"Once in a blue moon" means something that happens very rarely.',
    hindiExplanation: '"Once in a blue moon" का मतलब है — बहुत कम होना।',
    category: 'idiom', difficulty: 'beginner',
  },
  {
    question: 'What does "piece of cake" mean?',
    options: ['A slice of cake', 'Something very easy', 'A reward for hard work', 'Something delicious'],
    correctIndex: 1,
    explanation: '"Piece of cake" means something that is very easy to do.',
    hindiExplanation: '"Piece of cake" का मतलब है — बहुत आसान काम।',
    category: 'idiom', difficulty: 'beginner',
  },
  {
    question: 'What does "burn the midnight oil" mean?',
    options: ['To cook late at night', 'To work or study late into the night', 'To waste electricity', 'To feel very tired'],
    correctIndex: 1,
    explanation: '"Burn the midnight oil" means to work or study very late at night.',
    hindiExplanation: '"Burn the midnight oil" का मतलब है — रात देर तक काम या पढ़ाई करना।',
    category: 'idiom', difficulty: 'intermediate',
  },
];

const seedChallenges = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected.');

    const ops = challenges.map((c) => ({
      updateOne: {
        filter: { question: c.question },
        update: { $set: c },
        upsert: true,
      },
    }));

    const result = await DailyChallenge.bulkWrite(ops);
    console.log(`✅ Challenges seeded — upserted: ${result.upsertedCount}, matched: ${result.matchedCount}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

seedChallenges();
