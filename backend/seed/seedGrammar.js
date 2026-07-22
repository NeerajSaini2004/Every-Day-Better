// backend/seed/seedGrammar.js
// Run this with: node seed/seedGrammar.js

const mongoose = require('mongoose');
require('dotenv').config();

// Import model
const Grammar = require('../models/Grammar');

// Comprehensive grammar rules data
const grammarData = [
  // ========== PRESENT TENSE (9 rules) ==========
  // PRESENT SIMPLE
  {
    title: 'Present Simple - Formation',
    rule: 'Subject + Base Verb (3rd person singular adds -s/es)',
    hindiRule: 'विषय + मूल क्रिया (तीसरे व्यक्ति एकवचन में -s/es जोड़ें)',
    examples: [
      'I play cricket',
      'You play cricket',
      'He plays cricket',
      'She plays cricket',
      'It plays music',
      'We play cricket',
      'They play cricket'
    ],
    exampleSentence: 'I drink tea every morning.',
    hindiExample: 'मैं हर सुबह चाय पीता हूँ।',
    difficulty: 'beginner',
    category: 'present-simple',
    dayNumber: 10
  },
  {
    title: 'Present Simple - Usage',
    rule: 'Use for daily habits, universal truths, facts, and routines',
    hindiRule: 'दैनिक आदतों, सार्वभौमिक सत्यों, तथ्यों और दिनचर्या के लिए प्रयोग करें',
    examples: [
      'Birds fly south in winter',
      'The Earth revolves around the sun',
      'She goes to work at 9 AM',
      'Water boils at 100°C'
    ],
    exampleSentence: 'The sun rises in the east.',
    hindiExample: 'सूरज पूर्व में उगता है।',
    difficulty: 'beginner',
    category: 'present-simple',
    dayNumber: 10
  },
  {
    title: 'Present Simple - Common Mistakes',
    rule: 'Avoid: Forgetting -s with 3rd person singular; Using "do/does" incorrectly in affirmative',
    hindiRule: 'गलती: तीसरे व्यक्ति एकवचन के साथ -s भूलना; सकारात्मक वाक्यों में do/does का गलत प्रयोग',
    examples: [
      'WRONG: He go to school | RIGHT: He goes to school',
      'WRONG: She do homework | RIGHT: She does homework',
      'WRONG: It play music | RIGHT: It plays music'
    ],
    exampleSentence: 'He plays football (NOT: He play football)',
    hindiExample: 'वह फुटबॉल खेलता है (नहीं: वह फुटबॉल खेलते हैं)',
    difficulty: 'beginner',
    category: 'present-simple',
    dayNumber: 11
  },

  // PRESENT CONTINUOUS
  {
    title: 'Present Continuous - Formation',
    rule: 'Subject + am/is/are + Verb + ing',
    hindiRule: 'विषय + am/is/are + क्रिया + ing',
    examples: [
      'I am eating',
      'You are eating',
      'He is eating',
      'She is eating',
      'We are eating',
      'They are eating'
    ],
    exampleSentence: 'I am reading a book right now.',
    hindiExample: 'मैं अभी एक किताब पढ़ रहा हूँ।',
    difficulty: 'beginner',
    category: 'present-continuous',
    dayNumber: 12
  },
  {
    title: 'Present Continuous - Usage',
    rule: 'Use for actions happening NOW, actions that started before but are still continuing',
    hindiRule: 'अभी चल रही कार्रवाई, शुरू हुई लेकिन जारी है के लिए प्रयोग करें',
    examples: [
      'The rain is falling heavily',
      'Children are playing in the park',
      'She is studying for her exams',
      'They are watching a movie'
    ],
    exampleSentence: 'We are having lunch together.',
    hindiExample: 'हम साथ में दोपहर का खाना खा रहे हैं।',
    difficulty: 'intermediate',
    category: 'present-continuous',
    dayNumber: 12
  },
  {
    title: 'Present Continuous - Common Mistakes',
    rule: 'Avoid: State verbs with -ing; Forgetting "be" verb; Wrong spelling of -ing forms',
    hindiRule: 'स्थिति क्रियाओं के साथ -ing का प्रयोग न करें; "be" क्रिया भूल न जाएं',
    examples: [
      'WRONG: I am knowing him | RIGHT: I know him',
      'WRONG: She reading a book | RIGHT: She is reading a book',
      'WRONG: We are siting here | RIGHT: We are sitting here'
    ],
    exampleSentence: 'I am writing a letter (NOT: I am knowing the answer)',
    hindiExample: 'मैं पत्र लिख रहा हूँ (नहीं: मैं जवाब जान रहा हूँ)',
    difficulty: 'intermediate',
    category: 'present-continuous',
    dayNumber: 13
  },

  // PRESENT PERFECT
  {
    title: 'Present Perfect - Formation',
    rule: 'Subject + have/has + Past Participle',
    hindiRule: 'विषय + have/has + भूतकालीन कृदंत',
    examples: [
      'I have eaten',
      'You have eaten',
      'He has eaten',
      'She has eaten',
      'We have eaten',
      'They have eaten'
    ],
    exampleSentence: 'I have completed my homework.',
    hindiExample: 'मैंने अपना होमवर्क पूरा कर लिया है।',
    difficulty: 'intermediate',
    category: 'present-perfect',
    dayNumber: 14
  },
  {
    title: 'Present Perfect - Usage',
    rule: 'Use for recent actions with current relevance, experience, or actions continuing from past',
    hindiRule: 'वर्तमान प्रासंगिकता वाली हाल की कार्रवाई, अनुभव, या अतीत से जारी कार्रवाई',
    examples: [
      'He has won three awards',
      'I have visited Delhi twice',
      'She has worked here for 5 years',
      'They have just arrived'
    ],
    exampleSentence: 'We have lived in this city for 10 years.',
    hindiExample: 'हम इस शहर में 10 साल से रहते आ रहे हैं।',
    difficulty: 'intermediate',
    category: 'present-perfect',
    dayNumber: 14
  },

  // PRESENT PERFECT CONTINUOUS
  {
    title: 'Present Perfect Continuous - Formation',
    rule: 'Subject + have/has + been + Verb + ing',
    hindiRule: 'विषय + have/has + been + क्रिया + ing',
    examples: [
      'I have been studying',
      'You have been studying',
      'He has been studying',
      'She has been studying',
      'We have been studying',
      'They have been studying'
    ],
    exampleSentence: 'I have been working here since 2020.',
    hindiExample: 'मैं 2020 से यहाँ काम कर रहा हूँ।',
    difficulty: 'advanced',
    category: 'present-perfect-continuous',
    dayNumber: 15
  },

  // ========== PAST TENSE (9 rules) ==========
  // PAST SIMPLE
  {
    title: 'Past Simple - Formation',
    rule: 'Subject + Past Tense Verb (add -ed for regular verbs; irregular verbs have special forms)',
    hindiRule: 'विषय + भूतकाल क्रिया (नियमित क्रियाओं में -ed जोड़ें; अनियमित क्रियाओं के विशेष रूप)',
    examples: [
      'I played cricket',
      'You watched a movie',
      'He ate an apple',
      'She went to school',
      'We danced at the party',
      'They saw a film'
    ],
    exampleSentence: 'Yesterday, I visited my grandmother.',
    hindiExample: 'कल, मैंने अपनी दादी जी से मिलने गया।',
    difficulty: 'beginner',
    category: 'past-simple',
    dayNumber: 16
  },
  {
    title: 'Past Simple - Usage',
    rule: 'Use for completed actions in the past, past routines (used to), or specific time in past',
    hindiRule: 'अतीत में पूरी हुई कार्रवाई, पुरानी आदतें, या अतीत का विशिष्ट समय',
    examples: [
      'She left the office at 5 PM',
      'We went to Mumbai last year',
      'I studied in Mumbai',
      'They worked hard yesterday'
    ],
    exampleSentence: 'I finished my project last week.',
    hindiExample: 'मैंने पिछले हफ्ते अपनी परियोजना पूरी की।',
    difficulty: 'beginner',
    category: 'past-simple',
    dayNumber: 16
  },
  {
    title: 'Past Simple - Common Mistakes',
    rule: 'Avoid: Mixing regular and irregular forms; Using present tense with past time expressions',
    hindiRule: 'नियमित और अनियमित रूपों को मिलाना न करें; भूतकाल अभिव्यक्तियों के साथ वर्तमान काल न लगाएं',
    examples: [
      'WRONG: She go to school yesterday | RIGHT: She went to school yesterday',
      'WRONG: I eated an apple | RIGHT: I ate an apple',
      'WRONG: He play football last week | RIGHT: He played football last week'
    ],
    exampleSentence: 'He ran a marathon yesterday (NOT: He runs a marathon yesterday)',
    hindiExample: 'वह कल मैराथन दौड़ता था (नहीं: वह कल मैराथन दौड़ता है)',
    difficulty: 'beginner',
    category: 'past-simple',
    dayNumber: 17
  },

  // PAST CONTINUOUS
  {
    title: 'Past Continuous - Formation',
    rule: 'Subject + was/were + Verb + ing',
    hindiRule: 'विषय + was/were + क्रिया + ing',
    examples: [
      'I was eating',
      'You were eating',
      'He was eating',
      'She was eating',
      'We were eating',
      'They were eating'
    ],
    exampleSentence: 'I was reading when the phone rang.',
    hindiExample: 'जब फोन बजा तो मैं किताब पढ़ रहा था।',
    difficulty: 'intermediate',
    category: 'past-continuous',
    dayNumber: 18
  },
  {
    title: 'Past Continuous - Usage',
    rule: 'Use for actions in progress in the past, interrupted actions, or simultaneous past actions',
    hindiRule: 'अतीत में चल रही कार्रवाई, बाधित कार्रवाई, या साथ-साथ होने वाली कार्रवाई',
    examples: [
      'He was sleeping when they arrived',
      'We were discussing the project all day',
      'She was cooking while he was watching TV',
      'They were playing chess when I called'
    ],
    exampleSentence: 'While she was cooking, the doorbell rang.',
    hindiExample: 'जब वह खाना पका रही थी, तो दरवाज़े की घंटी बजी।',
    difficulty: 'intermediate',
    category: 'past-continuous',
    dayNumber: 18
  },

  // PAST PERFECT
  {
    title: 'Past Perfect - Formation',
    rule: 'Subject + had + Past Participle',
    hindiRule: 'विषय + had + भूतकालीन कृदंत',
    examples: [
      'I had eaten',
      'You had eaten',
      'He had eaten',
      'She had eaten',
      'We had eaten',
      'They had eaten'
    ],
    exampleSentence: 'I had finished my work before he arrived.',
    hindiExample: 'वह आने से पहले मैंने अपना काम खत्म कर दिया था।',
    difficulty: 'advanced',
    category: 'past-perfect',
    dayNumber: 19
  },
  {
    title: 'Past Perfect - Usage',
    rule: 'Use to show that one past action happened before another past action',
    hindiRule: 'यह दिखाने के लिए कि एक भूतकाल की कार्रवाई दूसरी से पहले हुई',
    examples: [
      'After they had eaten, they left',
      'She had studied for hours before the exam',
      'We had planned everything before the event',
      'He had worked there for 10 years before retirement'
    ],
    exampleSentence: 'Before she called me, I had already heard the news.',
    hindiExample: 'जब वह मुझे बुलाई, मैं पहले ही खबर सुन चुका था।',
    difficulty: 'advanced',
    category: 'past-perfect',
    dayNumber: 19
  },

  // PAST PERFECT CONTINUOUS
  {
    title: 'Past Perfect Continuous - Formation',
    rule: 'Subject + had + been + Verb + ing',
    hindiRule: 'विषय + had + been + क्रिया + ing',
    examples: [
      'I had been studying',
      'You had been studying',
      'He had been studying',
      'She had been studying',
      'We had been studying',
      'They had been studying'
    ],
    exampleSentence: 'They had been waiting for 2 hours when the bus arrived.',
    hindiExample: 'जब बस आई तो वे 2 घंटे से इंतज़ार कर रहे थे।',
    difficulty: 'advanced',
    category: 'past-perfect-continuous',
    dayNumber: 20
  },

  // ========== FUTURE TENSE (9 rules) ==========
  // FUTURE SIMPLE
  {
    title: 'Future Simple - Formation',
    rule: 'Subject + will + Base Verb (also: be going to + Base Verb)',
    hindiRule: 'विषय + will + मूल क्रिया (या: be going to + मूल क्रिया)',
    examples: [
      'I will eat',
      'You will eat',
      'He will eat',
      'She will eat',
      'We will eat',
      'They will eat'
    ],
    exampleSentence: 'I will visit you tomorrow.',
    hindiExample: 'मैं कल तुमसे मिलने जाऊँगा।',
    difficulty: 'beginner',
    category: 'future-simple',
    dayNumber: 21
  },
  {
    title: 'Future Simple - Usage',
    rule: 'Use for decisions made at the moment, predictions, or future facts',
    hindiRule: 'क्षण में लिए गए निर्णय, पूर्वानुमान, या भविष्य के तथ्य',
    examples: [
      'Look! It is going to rain',
      'I think he will succeed',
      'Summer will be very hot',
      'The meeting will be at 10 AM'
    ],
    exampleSentence: 'The weather will be sunny tomorrow.',
    hindiExample: 'कल मौसम धूप होगा।',
    difficulty: 'beginner',
    category: 'future-simple',
    dayNumber: 21
  },

  // FUTURE CONTINUOUS
  {
    title: 'Future Continuous - Formation',
    rule: 'Subject + will + be + Verb + ing',
    hindiRule: 'विषय + will + be + क्रिया + ing',
    examples: [
      'I will be studying',
      'You will be studying',
      'He will be studying',
      'She will be studying',
      'We will be studying',
      'They will be studying'
    ],
    exampleSentence: 'At this time tomorrow, I will be flying to London.',
    hindiExample: 'कल इसी समय, मैं लंदन को उड़ान भर रहा होऊँगा।',
    difficulty: 'intermediate',
    category: 'future-continuous',
    dayNumber: 22
  },
  {
    title: 'Future Continuous - Usage',
    rule: 'Use for ongoing actions at a specific time in the future',
    hindiRule: 'भविष्य में किसी विशिष्ट समय पर चल रही कार्रवाई',
    examples: [
      'He will be working in the office',
      'Next month, they will be living in their new house',
      'She will be attending the conference',
      'We will be celebrating the festival'
    ],
    exampleSentence: 'Tomorrow at 3 PM, she will be in a meeting.',
    hindiExample: 'कल 3 बजे, वह एक बैठक में होगी।',
    difficulty: 'intermediate',
    category: 'future-continuous',
    dayNumber: 22
  },

  // FUTURE PERFECT
  {
    title: 'Future Perfect - Formation',
    rule: 'Subject + will + have + Past Participle',
    hindiRule: 'विषय + will + have + भूतकालीन कृदंत',
    examples: [
      'I will have eaten',
      'You will have eaten',
      'He will have eaten',
      'She will have eaten',
      'We will have eaten',
      'They will have eaten'
    ],
    exampleSentence: 'By next year, I will have completed my studies.',
    hindiExample: 'अगले साल तक, मैं अपनी पढ़ाई पूरी कर लूँगा।',
    difficulty: 'advanced',
    category: 'future-perfect',
    dayNumber: 23
  },
  {
    title: 'Future Perfect - Usage',
    rule: 'Use for actions that will be completed before a specific future time',
    hindiRule: 'किसी विशिष्ट भविष्य समय से पहले पूरी होने वाली कार्रवाई',
    examples: [
      'By 5 PM, I will have finished the project',
      'Before he arrives, we will have prepared everything',
      'She will have graduated by December',
      'They will have finished the construction by summer'
    ],
    exampleSentence: 'By the time you arrive, I will have prepared dinner.',
    hindiExample: 'जब आप पहुँचेंगे, मैं डिनर तैयार कर लूँगा।',
    difficulty: 'advanced',
    category: 'future-perfect',
    dayNumber: 23
  },

  // FUTURE PERFECT CONTINUOUS
  {
    title: 'Future Perfect Continuous - Formation',
    rule: 'Subject + will + have + been + Verb + ing',
    hindiRule: 'विषय + will + have + been + क्रिया + ing',
    examples: [
      'I will have been studying',
      'You will have been studying',
      'He will have been studying',
      'She will have been studying',
      'We will have been studying',
      'They will have been studying'
    ],
    exampleSentence: 'By next month, I will have been working here for 5 years.',
    hindiExample: 'अगले महीने तक, मैं यहाँ 5 साल से काम कर रहा होऊँगा।',
    difficulty: 'advanced',
    category: 'future-perfect-continuous',
    dayNumber: 24
  },

  // ========== GRAMMAR FUNDAMENTALS (20+ rules) ==========
  // ARTICLES
  {
    title: 'Articles - Indefinite (A/An)',
    rule: 'Use "a" before consonant sounds, "an" before vowel sounds. Means one of something',
    hindiRule: 'व्यंजन ध्वनि से पहले "a", स्वर ध्वनि से पहले "an"। किसी चीज़ का मतलब एक है',
    examples: [
      'a cat',
      'an apple',
      'a university (U sound)',
      'an honest man (H is silent)',
      'a one-room apartment (W sound)',
      'an umbrella'
    ],
    exampleSentence: 'I saw a cat and an owl in the garden.',
    hindiExample: 'मैंने बगीचे में एक बिल्ली और एक उल्लू देखा।',
    difficulty: 'beginner',
    category: 'articles',
    dayNumber: 25
  },
  {
    title: 'Articles - Definite (The)',
    rule: 'Use "the" for specific, known things. Use for unique things, second mention, or proper nouns',
    hindiRule: 'विशिष्ट, ज्ञात चीजों के लिए "the" का प्रयोग करें। अद्वितीय चीजों, दूसरे उल्लेख, या उचित नामों के लिए',
    examples: [
      'The sun is bright',
      'The Himalayas',
      'I saw a dog. The dog was brown.',
      'The Prime Minister',
      'The Queen',
      'The Internet'
    ],
    exampleSentence: 'The teacher is in the classroom.',
    hindiExample: 'शिक्षक कक्षा में है।',
    difficulty: 'beginner',
    category: 'articles',
    dayNumber: 25
  },
  {
    title: 'Articles - Zero Article (No Article)',
    rule: 'No article before plural nouns (general), uncountable nouns, or proper nouns (names)',
    hindiRule: 'बहुवचन संज्ञाओं (सामान्य), अगणनीय संज्ञाओं, या उचित नामों से पहले कोई लेख नहीं',
    examples: [
      'Cats are animals',
      'Water is essential',
      'India is a country',
      'I like music',
      'She plays football',
      'Delhi is famous'
    ],
    exampleSentence: 'Apples are healthy fruits.',
    hindiExample: 'सेब स्वास्थ्यकर फल हैं।',
    difficulty: 'beginner',
    category: 'articles',
    dayNumber: 26
  },

  // PREPOSITIONS
  {
    title: 'Prepositions - In/On/At (Place)',
    rule: 'In: enclosed spaces; On: surfaces; At: specific points/locations',
    hindiRule: 'In: बंद स्थान; On: सतह; At: विशिष्ट बिंदु/स्थान',
    examples: [
      'In the room',
      'On the table',
      'At the station',
      'In the car',
      'On the roof',
      'At home'
    ],
    exampleSentence: 'The book is on the shelf in the room.',
    hindiExample: 'किताब कमरे की अलमारी पर है।',
    difficulty: 'beginner',
    category: 'prepositions',
    dayNumber: 27
  },
  {
    title: 'Prepositions - In/On/At (Time)',
    rule: 'In: months/years/seasons; On: dates/days; At: specific times/hours',
    hindiRule: 'In: महीने/साल/मौसम; On: तारीख/दिन; At: विशिष्ट समय/घंटे',
    examples: [
      'In January',
      'In 2023',
      'On Monday',
      'On the 15th',
      'At 3 PM',
      'At noon'
    ],
    exampleSentence: 'The meeting is on Monday at 10 AM in the office.',
    hindiExample: 'मीटिंग सोमवार को 10 बजे कार्यालय में है।',
    difficulty: 'beginner',
    category: 'prepositions',
    dayNumber: 27
  },
  {
    title: 'Prepositions - Other Common Uses',
    rule: 'By (near/before), From (origin), To (direction), For (purpose/duration), With (company)',
    hindiRule: 'By (पास/पहले), From (मूल), To (दिशा), For (उद्देश्य/अवधि), With (साथ)',
    examples: [
      'Sit by me',
      'Travel from Delhi to Mumbai',
      'This is for you',
      'Stay for 3 days',
      'Come with me'
    ],
    exampleSentence: 'I am going from home to the market with my friend.',
    hindiExample: 'मैं अपने दोस्त के साथ घर से बाजार जा रहा हूँ।',
    difficulty: 'intermediate',
    category: 'prepositions',
    dayNumber: 28
  },

  // CONJUNCTIONS
  {
    title: 'Conjunctions - Coordinating (And, But, Or)',
    rule: 'Connect equal ideas: And (addition), But (contrast), Or (choice)',
    hindiRule: 'समान विचारों को जोड़ें: And (जोड़), But (विपरीतता), Or (विकल्प)',
    examples: [
      'I like tea and coffee',
      'He is tall but weak',
      'You can go or stay',
      'She studied hard and passed',
      'I want to come but I am busy'
    ],
    exampleSentence: 'She plays tennis and cricket.',
    hindiExample: 'वह टेनिस और क्रिकेट खेलती है।',
    difficulty: 'beginner',
    category: 'conjunctions',
    dayNumber: 29
  },
  {
    title: 'Conjunctions - Subordinating (Because, If, When, While)',
    rule: 'Connect main clause to dependent clause. Show reason, condition, or time',
    hindiRule: 'मुख्य क्लॉज को आश्रित क्लॉज से जोड़ें। कारण, शर्त, या समय दिखाएँ',
    examples: [
      'I went because you asked',
      'If you study, you will pass',
      'When it rains, I stay home',
      'While she reads, I cook',
      'Although he is poor, he is happy'
    ],
    exampleSentence: 'I will come if I am free.',
    hindiExample: 'अगर मैं खाली हूँ तो आऊँगा।',
    difficulty: 'intermediate',
    category: 'conjunctions',
    dayNumber: 29
  },

  // MODAL VERBS
  {
    title: 'Modal Verbs - Can/Could',
    rule: 'Can (present ability), Could (past ability or polite request)',
    hindiRule: 'Can (वर्तमान क्षमता), Could (अतीत क्षमता या विनम्र अनुरोध)',
    examples: [
      'I can swim',
      'She can speak English',
      'I could run faster when young',
      'Could you help me?',
      'Can I use your pen?'
    ],
    exampleSentence: 'Can you drive a car?',
    hindiExample: 'क्या आप गाड़ी चला सकते हैं?',
    difficulty: 'beginner',
    category: 'modal-verbs',
    dayNumber: 30
  },
  {
    title: 'Modal Verbs - Should/Must',
    rule: 'Should (advice/recommendation), Must (strong obligation/necessity)',
    hindiRule: 'Should (सलाह/सिफारिश), Must (मजबूत बाध्यता/आवश्यकता)',
    examples: [
      'You should study hard',
      'I should eat healthy food',
      'You must wear a seatbelt',
      'We must follow the rules',
      'She should call her mother'
    ],
    exampleSentence: 'You must finish your homework today.',
    hindiExample: 'आपको आज अपना होमवर्क पूरा करना चाहिए।',
    difficulty: 'intermediate',
    category: 'modal-verbs',
    dayNumber: 30
  },
  {
    title: 'Modal Verbs - May/Might',
    rule: 'May (permission or possibility), Might (lesser possibility)',
    hindiRule: 'May (अनुमति या संभावना), Might (कम संभावना)',
    examples: [
      'May I come in?',
      'You may go now',
      'It may rain tomorrow',
      'He might be late',
      'They might not come'
    ],
    exampleSentence: 'May I leave early today?',
    hindiExample: 'क्या मैं आज जल्दी जा सकता हूँ?',
    difficulty: 'intermediate',
    category: 'modal-verbs',
    dayNumber: 31
  },

  // SUBJECT-VERB AGREEMENT
  {
    title: 'Subject-Verb Agreement - Singular/Plural',
    rule: 'Singular subject takes singular verb; Plural subject takes plural verb',
    hindiRule: 'एकवचन विषय के साथ एकवचन क्रिया; बहुवचन विषय के साथ बहुवचन क्रिया',
    examples: [
      'He is a teacher (singular)',
      'They are teachers (plural)',
      'The cat runs fast (singular)',
      'The cats run fast (plural)',
      'She plays football (singular)',
      'We play football (plural)'
    ],
    exampleSentence: 'The student is studying.',
    hindiExample: 'छात्र पढ़ाई कर रहा है।',
    difficulty: 'beginner',
    category: 'subject-verb-agreement',
    dayNumber: 32
  },
  {
    title: 'Subject-Verb Agreement - Collective Nouns',
    rule: 'Collective nouns can be singular or plural depending on context',
    hindiRule: 'सामूहिक संज्ञाएँ संदर्भ के आधार पर एकवचन या बहुवचन हो सकती हैं',
    examples: [
      'The team is strong (unity)',
      'The team are ready (individuals)',
      'The family is happy (unity)',
      'The family are at home (individuals)',
      'The class has 50 students'
    ],
    exampleSentence: 'The group is working together.',
    hindiExample: 'समूह एक साथ काम कर रहा है।',
    difficulty: 'intermediate',
    category: 'subject-verb-agreement',
    dayNumber: 32
  },

  // WORD ORDER
  {
    title: 'Word Order - Basic SVO (Subject-Verb-Object)',
    rule: 'English follows Subject + Verb + Object pattern',
    hindiRule: 'अंग्रेजी विषय + क्रिया + कर्म पैटर्न का पालन करती है',
    examples: [
      'I eat rice (Subject-Verb-Object)',
      'She loves books (Subject-Verb-Object)',
      'They play cricket (Subject-Verb-Object)',
      'We study hard (Subject-Verb-Adverb)',
      'He reads a newspaper (Subject-Verb-Object)'
    ],
    exampleSentence: 'The cat chased the mouse.',
    hindiExample: 'बिल्ली ने चूहे का पीछा किया।',
    difficulty: 'beginner',
    category: 'word-order',
    dayNumber: 33
  },
  {
    title: 'Word Order - Adjectives Before Nouns',
    rule: 'Adjectives come before the noun they modify',
    hindiRule: 'विशेषण संज्ञा से पहले आते हैं जिसे वे संशोधित करते हैं',
    examples: [
      'A beautiful garden',
      'The red car',
      'A tall building',
      'Three small birds',
      'An expensive watch'
    ],
    exampleSentence: 'The big red apple is delicious.',
    hindiExample: 'बड़ा लाल सेब स्वादिष्ट है।',
    difficulty: 'beginner',
    category: 'word-order',
    dayNumber: 33
  },

  // PARTS OF SPEECH
  {
    title: 'Nouns - Countable and Uncountable',
    rule: 'Countable: can be plural (book/books); Uncountable: cannot be plural (milk, sugar)',
    hindiRule: 'गणनीय: बहुवचन हो सकते हैं (किताब/किताबें); अगणनीय: बहुवचन नहीं हो सकते (दूध, चीनी)',
    examples: [
      'Countable: cat, cats; chair, chairs',
      'Uncountable: water, information, luggage',
      'Mixed: He has 2 apples (countable) and some milk (uncountable)'
    ],
    exampleSentence: 'I need one book and some paper.',
    hindiExample: 'मुझे एक किताब और कुछ कागज़ चाहिए।',
    difficulty: 'beginner',
    category: 'parts-of-speech',
    dayNumber: 34
  },
  {
    title: 'Verbs - Transitive and Intransitive',
    rule: 'Transitive: needs an object (eat, give, see); Intransitive: no object needed (sleep, run)',
    hindiRule: 'सकर्मक: कर्म चाहिए (खाना, देना, देखना); अकर्मक: कर्म नहीं चाहिए (सोना, दौड़ना)',
    examples: [
      'Transitive: She ate an apple (object: apple)',
      'Intransitive: He slept well (no object)',
      'I saw him (transitive - object: him)',
      'The baby cried (intransitive)'
    ],
    exampleSentence: 'He gave me a book.',
    hindiExample: 'उसने मुझे एक किताब दी।',
    difficulty: 'intermediate',
    category: 'parts-of-speech',
    dayNumber: 34
  },
  {
    title: 'Adjectives - Comparison (Comparative and Superlative)',
    rule: 'Comparative: -er or more; Superlative: -est or most',
    hindiRule: 'तुलनात्मक: -er या more; उच्चतम: -est या most',
    examples: [
      'Fast, faster, fastest',
      'Beautiful, more beautiful, most beautiful',
      'Good, better, best',
      'Bad, worse, worst',
      'Smart, smarter, smartest'
    ],
    exampleSentence: 'She is the most intelligent student in the class.',
    hindiExample: 'वह कक्षा में सबसे बुद्धिमान छात्रा है।',
    difficulty: 'intermediate',
    category: 'parts-of-speech',
    dayNumber: 35
  },

  // CONDITIONAL SENTENCES
  {
    title: 'Conditional - Zero Conditional (General Truth)',
    rule: 'If + Present Simple, Present Simple (always true)',
    hindiRule: 'If + Present Simple, Present Simple (हमेशा सच)',
    examples: [
      'If you heat water, it boils',
      'If it rains, the ground gets wet',
      'If you study, you learn',
      'If the sun rises, it becomes day'
    ],
    exampleSentence: 'If you add salt to water, it dissolves.',
    hindiExample: 'अगर आप पानी में नमक मिलाते हैं, तो वह घुल जाता है।',
    difficulty: 'intermediate',
    category: 'conditionals',
    dayNumber: 36
  },
  {
    title: 'Conditional - First Conditional (Possible Future)',
    rule: 'If + Present Simple, will + Base Verb (likely to happen)',
    hindiRule: 'If + Present Simple, will + मूल क्रिया (होने की संभावना है)',
    examples: [
      'If you study, you will pass',
      'If she comes, I will tell her',
      'If it rains, I will stay home',
      'If he arrives, we will start'
    ],
    exampleSentence: 'If you work hard, you will succeed.',
    hindiExample: 'अगर आप मेहनत करते हो, तो आप सफल हो जाओगे।',
    difficulty: 'intermediate',
    category: 'conditionals',
    dayNumber: 36
  },
  {
    title: 'Conditional - Second Conditional (Imaginary)',
    rule: 'If + Past Simple, would + Base Verb (unlikely/hypothetical)',
    hindiRule: 'If + Past Simple, would + मूल क्रिया (असंभावित/काल्पनिक)',
    examples: [
      'If I were rich, I would travel',
      'If she studied, she would pass',
      'If we had time, we would go',
      'If you asked, I would help'
    ],
    exampleSentence: 'If I had a car, I would drive to work.',
    hindiExample: 'अगर मेरे पास गाड़ी होती, तो मैं काम पर ड्राइव करता।',
    difficulty: 'advanced',
    category: 'conditionals',
    dayNumber: 37
  },
  {
    title: 'Conditional - Third Conditional (Past Regret)',
    rule: 'If + Past Perfect, would + have + Past Participle (impossible - about past)',
    hindiRule: 'If + Past Perfect, would + have + भूतकालीन कृदंत (असंभव - अतीत के बारे में)',
    examples: [
      'If I had studied, I would have passed',
      'If she had called, I would have helped',
      'If we had left early, we would have arrived on time',
      'If you had asked, I would have told you'
    ],
    exampleSentence: 'If I had known the truth, I would have told you.',
    hindiExample: 'अगर मैं सच जानता, तो मैं तुम्हें बताता।',
    difficulty: 'advanced',
    category: 'conditionals',
    dayNumber: 37
  },

  // PASSIVE VOICE
  {
    title: 'Passive Voice - Formation',
    rule: 'Subject + be (tense) + Past Participle (+ by agent)',
    hindiRule: 'विषय + be (काल) + भूतकालीन कृदंत (+ कर्ता द्वारा)',
    examples: [
      'Active: She writes a letter → Passive: A letter is written by her',
      'Active: They built the house → Passive: The house was built by them',
      'Active: I will buy a car → Passive: A car will be bought by me'
    ],
    exampleSentence: 'The cake was baked by my mother.',
    hindiExample: 'केक मेरी माँ द्वारा बनाया गया।',
    difficulty: 'intermediate',
    category: 'passive-voice',
    dayNumber: 38
  },
  {
    title: 'Passive Voice - When to Use',
    rule: 'Use when focus is on action, not on who does it; or when agent is unknown/unimportant',
    hindiRule: 'जब कर्ता पर नहीं कार्य पर ध्यान हो; या जब कर्ता अज्ञात/महत्वहीन हो',
    examples: [
      'My passport was stolen (agent unknown)',
      'The president was elected (focus on action)',
      'The bridge was opened last year',
      'Windows are made of glass'
    ],
    exampleSentence: 'Milk is delivered every morning.',
    hindiExample: 'दूध हर सुबह पहुँचाया जाता है।',
    difficulty: 'intermediate',
    category: 'passive-voice',
    dayNumber: 38
  },

  // REPORTED SPEECH
  {
    title: 'Reported Speech - Simple Present to Past',
    rule: 'Direct: "I like tea" → Reported: He said that he liked tea (tense shifts back)',
    hindiRule: 'सीधा: "मैं चाय पसंद करता हूँ" → परोक्ष: उसने कहा कि वह चाय पसंद करता है',
    examples: [
      'Direct: "I am tired" → Reported: She said she was tired',
      'Direct: "We live here" → Reported: They said they lived there',
      'Direct: "I work hard" → Reported: He said he worked hard'
    ],
    exampleSentence: 'She said that she would help me.',
    hindiExample: 'उसने कहा कि वह मेरी मदद करेगी।',
    difficulty: 'intermediate',
    category: 'reported-speech',
    dayNumber: 39
  },
  {
    title: 'Reported Speech - Questions',
    rule: 'Direct: "Where are you?" → Reported: He asked where I was (no inversion, no "?")',
    hindiRule: 'सीधा: "तुम कहाँ हो?" → परोक्ष: उसने पूछा कि मैं कहाँ था (कोई उलटफेर नहीं)',
    examples: [
      'Direct: "What time is it?" → Reported: She asked what time it was',
      'Direct: "Do you speak English?" → Reported: He asked if I spoke English',
      'Direct: "Where do you live?" → Reported: They asked where I lived'
    ],
    exampleSentence: 'He asked when I would arrive.',
    hindiExample: 'उसने पूछा कि मैं कब पहुँचूँगा।',
    difficulty: 'intermediate',
    category: 'reported-speech',
    dayNumber: 39
  },

  // GERUNDS AND INFINITIVES
  {
    title: 'Gerunds vs Infinitives - Gerunds (Verb + ing)',
    rule: 'Gerunds function as nouns: "Reading is fun" or after certain verbs: enjoy, avoid, consider',
    hindiRule: 'गेरंड्स संज्ञा के रूप में कार्य करते हैं: "पढ़ना मजेदार है" या कुछ क्रियाओं के बाद',
    examples: [
      'I enjoy reading books',
      'She avoids smoking',
      'They consider moving abroad',
      'Swimming is good exercise',
      'I like dancing'
    ],
    exampleSentence: 'Playing cricket is my favorite hobby.',
    hindiExample: 'क्रिकेट खेलना मैं सबसे पसंद हूँ।',
    difficulty: 'intermediate',
    category: 'gerunds-infinitives',
    dayNumber: 40
  },
  {
    title: 'Gerunds vs Infinitives - Infinitives (to + Verb)',
    rule: 'After certain verbs: want, need, decide, plan; After adjectives or "to be"',
    hindiRule: 'कुछ क्रियाओं के बाद: चाहना, चाहिए, निर्णय, योजना; विशेषणों या "to be" के बाद',
    examples: [
      'I want to sleep',
      'She needs to study',
      'They decided to leave',
      'It is easy to learn',
      'I am happy to help'
    ],
    exampleSentence: 'I need to finish my work today.',
    hindiExample: 'मुझे आज अपना काम खत्म करना चाहिए।',
    difficulty: 'intermediate',
    category: 'gerunds-infinitives',
    dayNumber: 40
  },

  // RELATIVE CLAUSES
  {
    title: 'Relative Clauses - Who/That/Which',
    rule: 'Who (people), That (people/things), Which (things); Introduce additional info about noun',
    hindiRule: 'Who (लोग), That (लोग/चीजें), Which (चीजें); संज्ञा के बारे में अतिरिक्त जानकारी',
    examples: [
      'The girl who studies hard will pass',
      'The book that I read was interesting',
      'The car which is red is mine',
      'The man that helped us was kind'
    ],
    exampleSentence: 'The student who scored highest won a prize.',
    hindiExample: 'जिस छात्र को सबसे अधिक अंक मिले, उसने पुरस्कार जीता।',
    difficulty: 'intermediate',
    category: 'relative-clauses',
    dayNumber: 41
  },
  {
    title: 'Relative Clauses - Where/When/Why',
    rule: 'Where (place), When (time), Why (reason); Add details about location, time, or reason',
    hindiRule: 'Where (स्थान), When (समय), Why (कारण); स्थान, समय, या कारण का विवरण जोड़ें',
    examples: [
      'The house where I live is big',
      'The day when I was born was rainy',
      'The reason why I left is personal',
      'The city where she works is beautiful'
    ],
    exampleSentence: 'I remember the time when we first met.',
    hindiExample: 'मुझे वह समय याद है जब हम पहली बार मिले थे।',
    difficulty: 'intermediate',
    category: 'relative-clauses',
    dayNumber: 41
  },

  // ADVERBS
  {
    title: 'Adverbs - Formation and Types',
    rule: 'Usually formed by adding -ly to adjective: quick → quickly; Modify verbs, adjectives, or other adverbs',
    hindiRule: 'आमतौर पर विशेषण में -ly जोड़कर बनाए जाते हैं; क्रिया, विशेषण, या अन्य क्रियाविशेषण को संशोधित करते हैं',
    examples: [
      'He walks quickly (modify verb)',
      'It is very beautiful (modify adjective)',
      'She runs extremely fast (modify adverb)',
      'Carefully, he opened the door',
      'Obviously, they are happy'
    ],
    exampleSentence: 'She speaks English fluently.',
    hindiExample: 'वह अंग्रेजी बहुत अच्छे से बोलती है।',
    difficulty: 'intermediate',
    category: 'adverbs',
    dayNumber: 42
  },
  {
    title: 'Adverbs - Position in Sentence',
    rule: 'Manner (end): slowly; Frequency (before main verb): often; Time (end): yesterday; Degree (before adj): very',
    hindiRule: 'तरीका (अंत): धीरे-धीरे; आवृत्ति (मुख्य क्रिया से पहले): अक्सर; समय (अंत): कल; डिग्री (विशेषण से पहले)',
    examples: [
      'She sings beautifully (manner - end)',
      'I often visit Delhi (frequency - before verb)',
      'We will meet tomorrow (time - end)',
      'The room is very clean (degree - before adjective)',
      'Carefully, I listened (emphasis - beginning)'
    ],
    exampleSentence: 'I have never seen such a beautiful sunset.',
    hindiExample: 'मैंने कभी ऐसा सुंदर सूर्यास्त नहीं देखा।',
    difficulty: 'intermediate',
    category: 'adverbs',
    dayNumber: 42
  }
];

// Connect to database and seed
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/everydaybetter')
  .then(() => {
    console.log('Connected to MongoDB');
    seedGrammar();
  })
  .catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
  });

async function seedGrammar() {
  try {
    // Clear existing grammar data
    await Grammar.deleteMany({});
    console.log('Cleared existing grammar data');

    // Insert grammar rules with day numbers spread across 42 days
    const insertedData = await Grammar.insertMany(grammarData);
    console.log(`✓ Successfully added ${insertedData.length} grammar rules!`);

    // Print summary
    console.log('\n========== GRAMMAR RULES SUMMARY ==========');
    console.log(`Total Rules Added: ${insertedData.length}`);

    // Count by category
    const categories = {};
    insertedData.forEach(rule => {
      categories[rule.category] = (categories[rule.category] || 0) + 1;
    });

    console.log('\nBreakdown by Category:');
    Object.entries(categories).forEach(([category, count]) => {
      console.log(`  ${category}: ${count} rules`);
    });

    // Count by difficulty
    const difficulties = {};
    insertedData.forEach(rule => {
      difficulties[rule.difficulty] = (difficulties[rule.difficulty] || 0) + 1;
    });

    console.log('\nBreakdown by Difficulty:');
    Object.entries(difficulties).forEach(([difficulty, count]) => {
      console.log(`  ${difficulty}: ${count} rules`);
    });

    // Show sample rules
    console.log('\n========== SAMPLE RULES ==========');
    console.log('\n1. Present Simple Formation:');
    console.log(`   English: ${insertedData[0].rule}`);
    console.log(`   Hindi: ${insertedData[0].hindiRule}`);
    console.log(`   Example: ${insertedData[0].exampleSentence}`);
    console.log(`   Hindi Example: ${insertedData[0].hindiExample}`);

    console.log('\n2. Articles - The:');
    console.log(`   English: ${insertedData[12].rule}`);
    console.log(`   Hindi: ${insertedData[12].hindiRule}`);
    console.log(`   Example: ${insertedData[12].exampleSentence}`);
    console.log(`   Hindi Example: ${insertedData[12].hindiExample}`);

    console.log('\n3. Modal Verbs - Should/Must:');
    console.log(`   English: ${insertedData[24].rule}`);
    console.log(`   Hindi: ${insertedData[24].hindiRule}`);
    console.log(`   Example: ${insertedData[24].exampleSentence}`);
    console.log(`   Hindi Example: ${insertedData[24].hindiExample}`);

    console.log('\n========================================\n');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding grammar rules:', error);
    process.exit(1);
  }
}
