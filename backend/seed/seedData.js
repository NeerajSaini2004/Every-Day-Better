require('dotenv').config();
const mongoose = require('mongoose');
const Day = require('../models/Day');
const Vocabulary = require('../models/Vocabulary');
const Quote = require('../models/Quote');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// weekNumber and totalXP are computed — not stored raw in daysData
const enrichDay = (d) => ({
  ...d,
  weekNumber: Math.ceil(d.dayNumber / 7),
  totalXP: d.tasks.reduce((sum, t) => sum + t.xp, 0),
});

const daysData = [
  {
    dayNumber: 1,
    title: 'Introduction & Basics',
    description: 'Welcome to Day 1! Today you will introduce yourself in English. Learn basic phrases like "My name is...", "I am from...", and "I like...". This is your first step to fluency!',
    theme: 'Introduction & Basics',
    tasks: [
      { type: 'speaking', title: 'Introduce Yourself', description: 'Stand in front of a mirror and introduce yourself in English for 2 minutes. Say your name, city, hobby, and one goal.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
      { type: 'listening', title: 'Watch: How to Introduce Yourself', description: 'Search YouTube for "how to introduce yourself in English" and watch a 5-minute video. Write down 5 phrases you heard.', xp: 15, duration: 5 },
      { type: 'reading', title: 'Read a Self-Introduction', description: 'Read this aloud: "Hello! My name is Rahul. I am from Delhi. I am 22 years old. I love cricket and I want to speak fluent English."', xp: 15, duration: 5, hasTimer: true },
      { type: 'vocabulary', title: 'Learn Basic Intro Words', description: 'Learn these 10 words: Hello, Name, Age, City, Hobby, Goal, Dream, Introduce, Greet, Fluent. Write each in a sentence.', xp: 20, duration: 10 },
      { type: 'grammar', title: 'Verb "To Be" Practice', description: 'Practice: I am, You are, He/She is. Make 5 sentences about yourself using these. Example: "I am a student."', xp: 15, duration: 10 },
      { type: 'confidence', title: 'Record Your Introduction', description: 'Record a 1-minute video or audio of yourself introducing yourself. Listen back and note what to improve.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
    ],
  },
  {
    dayNumber: 2,
    title: 'Daily Greetings',
    description: 'Day 2 is all about greetings! Learn how to say hello, goodbye, good morning, and how to ask "How are you?" like a native speaker. Greetings are the doorway to every conversation.',
    theme: 'Daily Greetings',
    tasks: [
      { type: 'speaking', title: 'Greet in 5 Different Ways', description: 'Say 5 different greetings aloud: Good morning, Hey, What\'s up, How are you doing, Nice to meet you. Use each in a mini sentence.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
      { type: 'listening', title: 'Watch: English Greetings Video', description: 'Watch a YouTube video on "English greetings for beginners". Note formal vs informal greetings.', xp: 15, duration: 5 },
      { type: 'reading', title: 'Read a Greeting Dialogue', description: 'Read aloud: "A: Good morning! How are you? B: I am fine, thank you! And you? A: I am great! Have a nice day!"', xp: 15, duration: 5, hasTimer: true },
      { type: 'vocabulary', title: 'Learn Greeting Words', description: 'Learn: Hello, Hi, Hey, Morning, Evening, Welcome, Goodbye, Bye, Take care, See you. Use each in a sentence.', xp: 20, duration: 10 },
      { type: 'grammar', title: 'Question Words Practice', description: 'Practice How, What, Where, When, Why. Make one greeting question with each. Example: "How are you?"', xp: 15, duration: 10 },
      { type: 'confidence', title: 'Greet a Family Member in English', description: 'Go greet one family member or friend in English today. Record what you said and how they reacted.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
    ],
  },
  {
    dayNumber: 3,
    title: 'Vocabulary Builder',
    description: 'Day 3 is dedicated to building your word power! The more words you know, the better you can express yourself. Today focus on learning new words and how to use them in daily conversation.',
    theme: 'Vocabulary Builder',
    tasks: [
      { type: 'speaking', title: 'Use 5 New Words in Sentences', description: 'Pick 5 new words from today\'s vocabulary list and speak one sentence each aloud. Try to make them about your real life.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
      { type: 'listening', title: 'Watch: Vocabulary Building Tips', description: 'Watch a video on "how to improve English vocabulary fast". Write 3 tips that you will follow.', xp: 15, duration: 5 },
      { type: 'reading', title: 'Read and Underline New Words', description: 'Read a short English paragraph and underline every word you don\'t know. Look up 5 of them and read the paragraph again.', xp: 15, duration: 5, hasTimer: true },
      { type: 'vocabulary', title: 'Learn 10 Power Words', description: 'Learn: Ambition, Courage, Discipline, Focus, Inspire, Achieve, Success, Persist, Adapt, Overcome. Write Hindi meanings too.', xp: 20, duration: 10 },
      { type: 'grammar', title: 'Noun vs Verb Practice', description: 'Identify if these words are noun or verb: run, book, dream, play, hope, work. Then use each as both noun and verb in sentences.', xp: 15, duration: 10 },
      { type: 'confidence', title: 'Vocabulary Story Challenge', description: 'Make a short 5-sentence story using at least 5 new words you learned today. Record yourself telling the story.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
    ],
  },
  {
    dayNumber: 4,
    title: 'Simple Sentences',
    description: 'Day 4: Master the art of simple, clear sentences. Many learners try to speak complex sentences and get confused. Today you will practice short, powerful sentences that communicate clearly.',
    theme: 'Simple Sentences',
    tasks: [
      { type: 'speaking', title: 'Speak in Simple Sentences', description: 'Describe your morning routine using only simple sentences. Example: "I woke up at 7. I brushed my teeth. I had tea." Speak for 2 minutes.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
      { type: 'listening', title: 'Watch: Simple English Sentences', description: 'Watch a slow English video (try "Simple English Videos" on YouTube). Focus on sentence structure.', xp: 15, duration: 5 },
      { type: 'reading', title: 'Read Simple Sentences Aloud', description: 'Read aloud: "The sun rises in the east. Birds sing in the morning. I drink tea every day. Simple sentences are powerful."', xp: 15, duration: 5, hasTimer: true },
      { type: 'vocabulary', title: 'Action Words (Verbs)', description: 'Learn 10 common action verbs: Eat, Sleep, Walk, Talk, Read, Write, Think, Listen, Learn, Speak. Make sentences with each.', xp: 20, duration: 10 },
      { type: 'grammar', title: 'Subject-Verb-Object Pattern', description: 'Practice SVO pattern. Example: "I (S) eat (V) rice (O)." Make 5 sentences following this pattern about your daily life.', xp: 15, duration: 10 },
      { type: 'confidence', title: 'Describe Your Room in English', description: 'Record yourself describing your room using simple sentences. Use: There is, There are, I have, It is.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
    ],
  },
  {
    dayNumber: 5,
    title: 'Pronunciation Basics',
    description: 'Day 5: Pronunciation matters! Today you will work on how to say words correctly. Don\'t aim for a foreign accent — aim for clarity. When people understand you easily, that\'s perfect pronunciation.',
    theme: 'Pronunciation Basics',
    tasks: [
      { type: 'speaking', title: 'Tongue Twisters Practice', description: 'Say these 3 times fast: "She sells seashells", "Peter Piper picked", "How much wood would a woodchuck chuck." Record yourself.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
      { type: 'listening', title: 'Watch: English Pronunciation Guide', description: 'Watch a video on English vowel sounds or consonant pronunciation. Practice mimicking the sounds you hear.', xp: 15, duration: 5 },
      { type: 'reading', title: 'Read Focusing on Sounds', description: 'Read aloud slowly: "Think, Thank, Three, Through, Breathe, Clothes, World, Girl, Bird." Pay attention to each sound.', xp: 15, duration: 5, hasTimer: true },
      { type: 'vocabulary', title: 'Tricky Pronunciation Words', description: 'Learn to pronounce: Colonel, Wednesday, February, Comfortable, Vegetable, Particularly, Literally, Necessary, Scissors, Psychology.', xp: 20, duration: 10 },
      { type: 'grammar', title: 'Silent Letters Practice', description: 'Study silent letters: K in Know/Knife, W in Write/Wrong, B in Climb/Bomb. Find 5 more words with silent letters.', xp: 15, duration: 10 },
      { type: 'confidence', title: 'Read a News Headline Aloud', description: 'Pick any English news headline and read it aloud clearly 3 times. Record it and check if you sound clear and confident.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
    ],
  },
  {
    dayNumber: 6,
    title: 'Numbers & Time',
    description: 'Day 6: Numbers and time are used in every conversation! Learn to say prices, ages, dates, and time in English. After today, you will never struggle with "What time is it?" again.',
    theme: 'Numbers & Time',
    tasks: [
      { type: 'speaking', title: 'Tell the Time in English', description: 'Look at a clock and say the time in 5 different ways. Example: "It is quarter past three", "It is 3:15", "It is almost 3:30".', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
      { type: 'listening', title: 'Watch: Telling Time in English', description: 'Watch a YouTube video on "how to tell time in English". Note phrases like "half past", "quarter to", "noon", "midnight".', xp: 15, duration: 5 },
      { type: 'reading', title: 'Read a Daily Schedule', description: 'Read aloud: "I wake up at 6:30 AM. I have lunch at 1 PM. School ends at 4:15. I sleep by 10:45 PM."', xp: 15, duration: 5, hasTimer: true },
      { type: 'vocabulary', title: 'Time & Number Words', description: 'Learn: Midnight, Noon, Dawn, Dusk, Decade, Century, Fortnight, Approximately, Precisely, Deadline. Use each in a sentence.', xp: 20, duration: 10 },
      { type: 'grammar', title: 'Prepositions of Time', description: 'Practice AT, ON, IN for time. AT 5 o\'clock, ON Monday, IN January, IN 2024. Make 5 sentences using correct prepositions.', xp: 15, duration: 10 },
      { type: 'confidence', title: 'Describe Your Daily Schedule', description: 'Record yourself describing your full day schedule in English using exact times. "I wake up at..., I eat at..., I sleep at..."', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
    ],
  },
  {
    dayNumber: 7,
    title: 'Colors & Objects',
    description: 'Day 7: One week done — great job! Today learn to describe things around you using colors, sizes, and shapes. This will help you describe objects clearly in any conversation.',
    theme: 'Colors & Objects',
    tasks: [
      { type: 'speaking', title: 'Describe 5 Objects Around You', description: 'Pick 5 objects near you and describe each in 2 sentences. Include color, size, and use. Example: "This is a blue pen. It is small and I use it for writing."', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
      { type: 'listening', title: 'Watch: Describing Objects in English', description: 'Watch a video where someone describes everyday objects. Note how they use adjectives like big, small, round, heavy, smooth.', xp: 15, duration: 5 },
      { type: 'reading', title: 'Read Object Descriptions', description: 'Read aloud: "The red book is thick and heavy. The small white cup is on the table. My black phone has a cracked screen."', xp: 15, duration: 5, hasTimer: true },
      { type: 'vocabulary', title: 'Colors, Shapes & Sizes', description: 'Learn: Scarlet, Crimson, Oval, Rectangular, Transparent, Glossy, Rough, Tiny, Enormous, Fragile. Write one sentence each.', xp: 20, duration: 10 },
      { type: 'grammar', title: 'Adjective Order Practice', description: 'In English, adjective order matters: Opinion-Size-Age-Color-Material-Noun. Practice: "a beautiful small old blue wooden box."', xp: 15, duration: 10 },
      { type: 'confidence', title: 'Describe What You\'re Wearing', description: 'Record yourself describing your outfit today. Include all colors, fabric if you know, and style. Speak for 1 full minute.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
    ],
  },
  {
    dayNumber: 8,
    title: 'Family & Relations',
    description: 'Day 8: Family is the most common topic in English conversations! Learn how to talk about your family members, relationships, and describe people you love. Great for interviews and social conversations.',
    theme: 'Family & Relations',
    tasks: [
      { type: 'speaking', title: 'Talk About Your Family', description: 'Speak for 2 minutes about your family. How many members? What do they do? One special thing about each person.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
      { type: 'listening', title: 'Watch: Family Vocabulary in English', description: 'Watch a video about family relations in English. Note words like nephew, niece, cousin, in-laws, and extended family.', xp: 15, duration: 5 },
      { type: 'reading', title: 'Read a Family Description', description: 'Read aloud: "My family has five members. My father is a teacher. My mother is a homemaker. I have one elder brother and one younger sister."', xp: 15, duration: 5, hasTimer: true },
      { type: 'vocabulary', title: 'Family Relation Words', description: 'Learn: Sibling, Relative, Ancestor, Descendant, Guardian, Spouse, Nephew, Niece, Maternal, Paternal. Use in sentences.', xp: 20, duration: 10 },
      { type: 'grammar', title: 'Possessive Pronouns Practice', description: 'Practice: My, Your, His, Her, Our, Their. Make sentences: "My father is kind. Her sister is a doctor. Their parents are retired."', xp: 15, duration: 10 },
      { type: 'confidence', title: 'Introduce Your Family', description: 'Record a 1-minute audio introducing each of your family members as if talking to a new friend. Be warm and natural.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
    ],
  },
  {
    dayNumber: 9,
    title: 'Food & Drinks',
    description: 'Day 9: Everyone loves talking about food! Learn to order food, describe taste, and talk about your favorite meals in English. This topic comes up in restaurants, interviews, and casual chats.',
    theme: 'Food & Drinks',
    tasks: [
      { type: 'speaking', title: 'Describe Your Favorite Food', description: 'Speak for 2 minutes about your favorite food. What is it? How does it taste? When do you eat it? Who makes it?', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
      { type: 'listening', title: 'Watch: Ordering Food in English', description: 'Watch a video on "how to order food in a restaurant in English." Note the phrases used by customer and waiter.', xp: 15, duration: 5 },
      { type: 'reading', title: 'Read a Restaurant Dialogue', description: 'Read aloud: "Waiter: May I take your order? Customer: Yes, I\'d like a veggie burger and a glass of cold water please. Waiter: Great choice!"', xp: 15, duration: 5, hasTimer: true },
      { type: 'vocabulary', title: 'Food & Taste Words', description: 'Learn: Savory, Bland, Crunchy, Tender, Spicy, Refreshing, Appetizer, Cuisine, Portion, Sip. Write sentences using each.', xp: 20, duration: 10 },
      { type: 'grammar', title: 'Countable vs Uncountable Nouns', description: 'Food nouns: Rice (uncountable), Apple (countable). Practice: "I want some rice" vs "I want an apple." Make 5 pairs.', xp: 15, duration: 10 },
      { type: 'confidence', title: 'Order Food in English', description: 'Pretend you are in a restaurant. Record yourself ordering a full meal — starter, main course, drink, and dessert — politely in English.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
    ],
  },
  {
    dayNumber: 10,
    title: 'Daily Routine',
    description: 'Day 10: 1/6th of your journey complete! Today learn to talk about your daily routine fluently. This is one of the most asked topics in English interviews and conversations. Master it today!',
    theme: 'Daily Routine',
    tasks: [
      { type: 'speaking', title: 'Describe Your Full Day', description: 'Speak for 2 minutes describing your entire daily routine from waking up to sleeping. Use time expressions like first, then, after that, finally.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
      { type: 'listening', title: 'Watch: Daily Routine in English', description: 'Watch a video where someone describes their daily routine. Note transition words they use: first, next, then, after, finally, before.', xp: 15, duration: 5 },
      { type: 'reading', title: 'Read a Daily Routine Paragraph', description: 'Read aloud: "I wake up at 6 AM. First, I exercise for 30 minutes. Then I shower and have breakfast. After that, I study English for one hour."', xp: 15, duration: 5, hasTimer: true },
      { type: 'vocabulary', title: 'Routine & Time Words', description: 'Learn: Commute, Routine, Habit, Schedule, Leisure, Productive, Consistent, Priority, Balance, Mindful. Write daily routine sentences.', xp: 20, duration: 10 },
      { type: 'grammar', title: 'Simple Present Tense', description: 'Daily routines use simple present. Practice: "I wake up, She studies, He goes." Make 5 sentences about your routine using correct form.', xp: 15, duration: 10 },
      { type: 'confidence', title: '10-Day Reflection', description: 'Record yourself talking about what you have learned in the past 10 days. What improved? What was hard? What will you keep doing?', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
    ],
  },
  
{
  dayNumber: 11,
  title: 'Weather & Seasons',
  description: 'Day 11: Learn how to talk about weather and seasons naturally in English. Weather is one of the most common conversation starters around the world.',
  theme: 'Weather & Seasons',
  tasks: [
    { type: 'speaking', title: 'Talk About Today’s Weather', description: 'Speak for 2 minutes describing today’s weather in your city. Mention temperature, sky condition, humidity, and your feelings about it.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch an English Weather Report', description: 'Watch a weather forecast video in English and note 5 weather-related expressions.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read About Seasons', description: 'Read a short paragraph about summer, winter, rainy season, and spring aloud twice.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Weather Vocabulary', description: 'Learn: Humid, Forecast, Breeze, Storm, Foggy, Drizzle, Climate, Thunder, Sunny, Chilly.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Present Continuous for Weather', description: 'Practice sentences like: "It is raining", "The wind is blowing". Write 5 examples.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Become a Weather Reporter', description: 'Record yourself acting like a TV weather reporter for 1 minute.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 12,
  title: 'Shopping & Money',
  description: 'Day 12: Learn English used while shopping, bargaining, asking prices, and discussing money confidently.',
  theme: 'Shopping & Money',
  tasks: [
    { type: 'speaking', title: 'Shopping Conversation Practice', description: 'Pretend you are shopping in a mall. Speak a conversation between customer and shopkeeper.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Shopping English Dialogues', description: 'Watch a shopping conversation video and note useful phrases.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read a Shopping Dialogue', description: 'Read aloud a conversation about buying clothes from a shop.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Money & Shopping Words', description: 'Learn: Discount, Expensive, Cheap, Receipt, Budget, Wallet, Refund, Purchase, Bargain, Cashier.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Question Sentences', description: 'Practice questions like: "How much is this?", "Can I pay online?". Write 5 examples.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Describe Your Last Shopping Experience', description: 'Record yourself explaining what you bought recently and how much it cost.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 13,
  title: 'Travel & Directions',
  description: 'Day 13: Learn how to ask for directions, book tickets, and communicate while traveling.',
  theme: 'Travel & Directions',
  tasks: [
    { type: 'speaking', title: 'Ask for Directions', description: 'Practice asking and answering direction questions like: "Where is the station?"', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Travel English Videos', description: 'Watch an airport or travel conversation video.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Travel Instructions', description: 'Read aloud travel-related instructions and route descriptions.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Travel Vocabulary', description: 'Learn: Journey, Destination, Route, Boarding, Passenger, Luggage, Ticket, Highway, Explore, Tourist.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Imperative Sentences', description: 'Practice command sentences: "Turn left", "Go straight", "Take the bus".', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Describe Your Dream Destination', description: 'Record yourself speaking about a place you want to visit and why.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 14,
  title: 'Work & Office',
  description: 'Day 14: Learn professional English used in workplaces and offices.',
  theme: 'Work & Office',
  tasks: [
    { type: 'speaking', title: 'Describe Your Work or Study', description: 'Speak about your daily work, college, or career goals.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Office English Conversations', description: 'Watch workplace communication examples in English.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Office Emails', description: 'Read a sample office email aloud clearly.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Office Vocabulary', description: 'Learn: Deadline, Meeting, Project, Client, Salary, Promotion, Resume, Manager, Presentation, Colleague.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Formal Sentence Practice', description: 'Write 5 professional formal sentences.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Introduce Yourself Professionally', description: 'Record a professional self-introduction for interviews.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 15,
  title: 'Health & Body',
  description: 'Day 15: Learn to talk about health problems, body parts, fitness, and doctor conversations.',
  theme: 'Health & Body',
  tasks: [
    { type: 'speaking', title: 'Talk About Your Health Routine', description: 'Speak about your exercise, sleep, water intake, and healthy habits.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Health English Videos', description: 'Watch a doctor-patient English conversation.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Health Tips', description: 'Read a paragraph about staying healthy.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Health Vocabulary', description: 'Learn: Fever, Injury, Fitness, Nutrition, Medicine, Symptoms, Disease, Treatment, Recovery, Exercise.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Should / Must Practice', description: 'Practice advice sentences using should and must.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Explain a Health Problem', description: 'Record yourself explaining a health issue to a doctor.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 16,
  title: 'Emotions & Feelings',
  description: 'Day 16: Learn how to express your emotions and feelings naturally in English conversations.',
  theme: 'Emotions & Feelings',
  tasks: [
    { type: 'speaking', title: 'Talk About Your Feelings', description: 'Speak for 2 minutes about how you felt today and why.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Emotional Conversations', description: 'Watch a short emotional conversation scene in English and note feeling expressions.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Feeling Expressions', description: 'Read aloud sentences expressing happiness, sadness, anger, and excitement.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Emotion Vocabulary', description: 'Learn: Excited, Nervous, Frustrated, Grateful, Lonely, Confused, Proud, Embarrassed, Relaxed, Motivated.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Using “Feel” Correctly', description: 'Practice sentences like: "I feel happy", "She feels nervous". Write 5 examples.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Share a Personal Experience', description: 'Record yourself talking about a moment when you felt very happy or proud.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 17,
  title: 'Hobbies & Interests',
  description: 'Day 17: Learn to speak confidently about your hobbies and interests.',
  theme: 'Hobbies & Interests',
  tasks: [
    { type: 'speaking', title: 'Describe Your Hobby', description: 'Speak for 2 minutes about your favorite hobby and why you enjoy it.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Hobby Discussions', description: 'Watch people talking about hobbies in English.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read About Hobbies', description: 'Read a short article about popular hobbies aloud.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Hobby Vocabulary', description: 'Learn: Painting, Gardening, Photography, Gaming, Adventure, Creative, Passion, Collection, Explore, Relaxation.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Like / Love / Enjoy Usage', description: 'Practice sentences using like, love, enjoy, and prefer.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Teach Your Hobby', description: 'Record yourself explaining how someone can start your hobby.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 18,
  title: 'Technology & Internet',
  description: 'Day 18: Learn modern English used in technology and internet conversations.',
  theme: 'Technology & Internet',
  tasks: [
    { type: 'speaking', title: 'Talk About Technology', description: 'Speak about how technology helps your daily life.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch a Tech Video', description: 'Watch a beginner-friendly technology video in English.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read a Tech Article', description: 'Read aloud a simple article about smartphones or AI.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Technology Vocabulary', description: 'Learn: Software, Internet, Device, Application, Update, Download, Password, Artificial Intelligence, Browser, Network.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Present Perfect Practice', description: 'Practice: "I have used", "She has downloaded". Write 5 examples.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Explain Your Favorite App', description: 'Record yourself explaining your favorite mobile app and its features.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 19,
  title: 'Nature & Environment',
  description: 'Day 19: Learn English vocabulary and conversations related to nature and the environment.',
  theme: 'Nature & Environment',
  tasks: [
    { type: 'speaking', title: 'Describe Nature Around You', description: 'Speak about parks, trees, rivers, or weather in your area.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Nature Documentaries', description: 'Watch a short English documentary about nature.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read About Environment', description: 'Read aloud a paragraph on protecting the environment.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Nature Vocabulary', description: 'Learn: Pollution, Forest, Wildlife, Climate, Ecosystem, Recycle, Conservation, Renewable, Habitat, Sustainability.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Comparative Adjectives', description: 'Practice: cleaner, greener, bigger, safer. Write 5 comparison sentences.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Give an Environmental Speech', description: 'Record a short speech on saving nature and reducing pollution.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 20,
  title: 'Sports & Games',
  description: 'Day 20: Learn how to discuss sports, fitness, games, and competitions in English.',
  theme: 'Sports & Games',
  tasks: [
    { type: 'speaking', title: 'Talk About Your Favorite Sport', description: 'Speak for 2 minutes about your favorite sport or game.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Sports Commentary', description: 'Watch English sports commentary and note energetic expressions.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Sports News', description: 'Read aloud a sports news article clearly.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Sports Vocabulary', description: 'Learn: Tournament, Athlete, Victory, Defeat, Championship, Referee, Strategy, Fitness, Training, Competition.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Past Tense Practice', description: 'Practice talking about past matches using past tense.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Commentate a Match', description: 'Record yourself giving live commentary of a match for 1 minute.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 21,
  title: 'Education & Learning',
  description: 'Day 21: Learn how to discuss studies, school, college, exams, and learning experiences in English.',
  theme: 'Education & Learning',
  tasks: [
    { type: 'speaking', title: 'Talk About Your Education', description: 'Speak for 2 minutes about your school, college, favorite subject, and future learning goals.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Study Motivation Videos', description: 'Watch an English study motivation or learning tips video.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read About Learning Habits', description: 'Read aloud a paragraph about effective study habits.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Education Vocabulary', description: 'Learn: Assignment, Examination, Scholarship, Lecture, Knowledge, Discipline, Internship, Research, Curriculum, Degree.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Future Tense Practice', description: 'Practice future tense sentences about your career and education plans.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Give a Study Advice Speech', description: 'Record yourself giving study tips to junior students.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 22,
  title: 'Friends & Social Life',
  description: 'Day 22: Learn to communicate naturally with friends and in social situations.',
  theme: 'Friends & Social Life',
  tasks: [
    { type: 'speaking', title: 'Talk About Your Best Friend', description: 'Speak for 2 minutes describing your best friend and your memories together.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Friendly Conversations', description: 'Watch casual English conversations between friends.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read a Friendship Story', description: 'Read aloud a short story about friendship.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Social Vocabulary', description: 'Learn: Friendship, Supportive, Trustworthy, Bond, Socialize, Companion, Loyalty, Conversation, Respect, Kindness.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Past Memories Practice', description: 'Write 5 sentences about memories with friends using past tense.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Call a Friend in English', description: 'Try speaking to a friend in English for at least 2 minutes and record your experience.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 23,
  title: 'Festivals & Culture',
  description: 'Day 23: Learn to talk about traditions, festivals, and cultural celebrations in English.',
  theme: 'Festivals & Culture',
  tasks: [
    { type: 'speaking', title: 'Describe a Festival', description: 'Speak about your favorite festival and how your family celebrates it.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Cultural Videos', description: 'Watch an English video about traditions or festivals.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Festival Articles', description: 'Read aloud an article about Diwali, Holi, Eid, Christmas, or another festival.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Festival Vocabulary', description: 'Learn: Tradition, Celebration, Ceremony, Heritage, Ritual, Decoration, Gathering, Culture, Community, Festival.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Sequence Words Practice', description: 'Practice words like first, next, then, finally while describing celebrations.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Give a Festival Speech', description: 'Record yourself explaining one Indian festival in English confidently.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 24,
  title: 'News & Current Events',
  description: 'Day 24: Improve your English by discussing news and current events confidently.',
  theme: 'News & Current Events',
  tasks: [
    { type: 'speaking', title: 'Talk About Today’s News', description: 'Speak for 2 minutes about a news topic you recently heard.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch English News', description: 'Watch a short English news bulletin and note important words.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read a News Article', description: 'Read aloud a short current affairs article clearly.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'News Vocabulary', description: 'Learn: Headline, Breaking News, Journalist, Economy, Election, Report, Media, Debate, Policy, Global.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Reported Speech Basics', description: 'Practice changing direct speech into reported speech.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Become a News Anchor', description: 'Record yourself presenting news like a TV anchor.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 25,
  title: 'Movies & Music',
  description: 'Day 25: Learn English naturally through movies, songs, and entertainment.',
  theme: 'Movies & Music',
  tasks: [
    { type: 'speaking', title: 'Review a Movie or Song', description: 'Speak about your favorite movie, actor, or song and explain why you like it.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Listen to an English Song', description: 'Listen to an English song and write down 5 words you understand.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Movie Reviews', description: 'Read aloud a short movie review clearly.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Entertainment Vocabulary', description: 'Learn: Soundtrack, Director, Performance, Genre, Lyrics, Audience, Cinema, Melody, Dialogue, Actor.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Opinion Sentences', description: 'Practice: "I think", "In my opinion", "I believe". Write 5 opinion sentences.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Act a Movie Scene', description: 'Record yourself acting or mimicking a famous movie dialogue in English.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},


{
  dayNumber: 26,
  title: 'Cooking & Recipes',
  description: 'Day 26: Learn English used while cooking, following recipes, and talking about food preparation.',
  theme: 'Cooking & Recipes',
  tasks: [
    { type: 'speaking', title: 'Explain a Recipe', description: 'Speak for 2 minutes explaining how to make your favorite dish step by step.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Cooking Videos', description: 'Watch a simple English cooking tutorial and note useful cooking words.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read a Recipe Aloud', description: 'Read aloud an English recipe clearly and slowly.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Cooking Vocabulary', description: 'Learn: Boil, Fry, Bake, Ingredients, Recipe, Stir, Chop, Flavor, Kitchen, Delicious.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Imperative Verbs Practice', description: 'Practice cooking instructions like: "Cut the onions", "Mix the ingredients".', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Become a Cooking Host', description: 'Record yourself acting like a cooking show host for 1 minute.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 27,
  title: 'Fashion & Clothing',
  description: 'Day 27: Learn to describe clothes, styles, fashion choices, and shopping conversations.',
  theme: 'Fashion & Clothing',
  tasks: [
    { type: 'speaking', title: 'Describe Your Outfit', description: 'Speak about what you are wearing today including colors and style.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Fashion Conversations', description: 'Watch a fashion or shopping-related English video.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Clothing Descriptions', description: 'Read aloud descriptions of different outfits and styles.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Fashion Vocabulary', description: 'Learn: Casual, Formal, Trendy, Elegant, Fabric, Accessories, Outfit, Stylish, Traditional, Designer.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Adjective Practice', description: 'Practice descriptive adjectives for clothes and appearance.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Fashion Review', description: 'Record yourself reviewing your favorite clothing style confidently.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 28,
  title: 'Home & Furniture',
  description: 'Day 28: Learn how to describe your home, rooms, furniture, and household items in English.',
  theme: 'Home & Furniture',
  tasks: [
    { type: 'speaking', title: 'Describe Your Home', description: 'Speak for 2 minutes describing your house or room.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Home Tour Videos', description: 'Watch a home tour video in English and note descriptive phrases.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Home Descriptions', description: 'Read aloud a paragraph describing a beautiful house.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Furniture Vocabulary', description: 'Learn: Sofa, Cabinet, Balcony, Curtain, Mattress, Shelf, Decoration, Appliance, Interior, Comfortable.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'There Is / There Are', description: 'Practice describing rooms using there is and there are.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Give a Room Tour', description: 'Record yourself giving an English tour of your room or home.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 29,
  title: 'Animals & Pets',
  description: 'Day 29: Learn English vocabulary and conversations about animals and pets.',
  theme: 'Animals & Pets',
  tasks: [
    { type: 'speaking', title: 'Talk About Animals', description: 'Speak about your favorite animal or pet and why you like it.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Animal Documentaries', description: 'Watch a short English animal documentary.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Animal Facts', description: 'Read aloud interesting facts about animals.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Animal Vocabulary', description: 'Learn: Wildlife, Domestic, Habitat, Predator, Loyal, Fur, Species, Jungle, Creature, Companion.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Can / Cannot Practice', description: 'Practice sentences like: "Birds can fly", "Fish cannot walk".', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Animal Documentary Voiceover', description: 'Record yourself speaking like a wildlife documentary narrator.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 30,
  title: 'Science & Discovery',
  description: 'Day 30: Halfway there! Learn how to discuss science, inventions, and discoveries in English.',
  theme: 'Science & Discovery',
  tasks: [
    { type: 'speaking', title: 'Talk About Technology or Science', description: 'Speak about a scientific invention that changed the world.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Science Videos', description: 'Watch a beginner-friendly science video in English.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Science Articles', description: 'Read aloud a short article about science or inventions.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Science Vocabulary', description: 'Learn: Experiment, Discovery, Innovation, Research, Scientist, Laboratory, Theory, Energy, Machine, Universe.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Passive Voice Basics', description: 'Practice passive sentences like: "Electricity was discovered..."', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Explain an Invention', description: 'Record yourself explaining how a modern invention helps people.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},


{
  dayNumber: 31,
  title: 'Business English',
  description: 'Day 31: Learn professional English used in meetings, offices, and business communication.',
  theme: 'Business English',
  tasks: [
    { type: 'speaking', title: 'Professional Introduction', description: 'Speak for 2 minutes introducing yourself professionally.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Business Meetings', description: 'Watch an English business meeting conversation.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Business Emails', description: 'Read aloud a professional email slowly and clearly.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Business Vocabulary', description: 'Learn: Revenue, Profit, Client, Negotiation, Strategy, Investment, Deadline, Marketing, Startup, Leadership.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Formal Writing Practice', description: 'Practice formal professional sentence structures.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Pitch Yourself', description: 'Record yourself giving a professional self-presentation confidently.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 32,
  title: 'Interview Skills',
  description: 'Day 32: Learn how to answer interview questions confidently in English.',
  theme: 'Interview Skills',
  tasks: [
    { type: 'speaking', title: 'Answer Interview Questions', description: 'Practice answering: Tell me about yourself, strengths, weaknesses, and goals.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Mock Interviews', description: 'Watch English mock interview videos and note professional answers.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Interview Answers', description: 'Read aloud sample interview responses clearly.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Interview Vocabulary', description: 'Learn: Experience, Qualification, Responsibility, Teamwork, Communication, Adaptability, Skills, Leadership, Achievement, Opportunity.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Past Experience Practice', description: 'Practice talking about previous experiences using past tense.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Mock Interview Recording', description: 'Record yourself answering interview questions professionally.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 33,
  title: 'Email Writing',
  description: 'Day 33: Learn how to write clear and professional emails in English.',
  theme: 'Email Writing',
  tasks: [
    { type: 'speaking', title: 'Explain an Email', description: 'Speak about when and why emails are important.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Email Writing Tutorials', description: 'Watch a video explaining professional email writing.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Sample Emails', description: 'Read aloud formal and informal email examples.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Email Vocabulary', description: 'Learn: Subject, Attachment, Recipient, Regards, Inquiry, Confirmation, Reminder, Draft, Compose, Forward.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Polite Sentences Practice', description: 'Practice polite email phrases like: "Could you please..."', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Read Your Own Email', description: 'Write a short professional email and record yourself reading it confidently.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 34,
  title: 'Phone Conversations',
  description: 'Day 34: Learn how to communicate clearly during phone calls in English.',
  theme: 'Phone Conversations',
  tasks: [
    { type: 'speaking', title: 'Phone Call Practice', description: 'Pretend to call someone and practice introducing yourself politely.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Listen to Phone Conversations', description: 'Watch or listen to English customer support or phone call examples.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Call Dialogues', description: 'Read aloud common phone conversation scripts.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Phone Vocabulary', description: 'Learn: Caller, Hold, Dial, Voicemail, Connection, Receiver, Conversation, Network, Busy, Transfer.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Question Formation Practice', description: 'Practice polite questions used in phone calls.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Customer Support Roleplay', description: 'Record yourself handling a customer support phone call professionally.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 35,
  title: 'Presentations',
  description: 'Day 35: Learn how to give presentations confidently in English.',
  theme: 'Presentations',
  tasks: [
    { type: 'speaking', title: 'Mini Presentation Practice', description: 'Give a 2-minute presentation on any simple topic.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Public Presentations', description: 'Watch a TED-style talk or presentation in English.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Presentation Scripts', description: 'Read aloud an introduction and conclusion of a presentation.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Presentation Vocabulary', description: 'Learn: Audience, Slide, Introduction, Conclusion, Explain, Demonstrate, Key Point, Visual, Summary, Presentation.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Transition Words Practice', description: 'Practice words like firstly, moreover, finally, therefore.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Record a Presentation', description: 'Record yourself presenting confidently while maintaining eye contact.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 36,
  title: 'Debate & Discussion',
  description: 'Day 36: Learn how to express opinions, agree, disagree, and participate in discussions confidently.',
  theme: 'Debate & Discussion',
  tasks: [
    { type: 'speaking', title: 'Express Your Opinion', description: 'Speak for 2 minutes on a topic like social media, online learning, or AI.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Debates in English', description: 'Watch a simple English debate and note useful expressions.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Opinion Articles', description: 'Read aloud a short opinion article or discussion paragraph.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Debate Vocabulary', description: 'Learn: Opinion, Argument, Perspective, Evidence, Agree, Disagree, Discussion, Point, Counterargument, Debate.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Opinion Sentence Practice', description: 'Practice: "I think", "In my opinion", "I strongly believe".', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Mini Debate Recording', description: 'Record yourself supporting or opposing a topic confidently.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 37,
  title: 'Storytelling',
  description: 'Day 37: Learn how to tell interesting stories in English with confidence and flow.',
  theme: 'Storytelling',
  tasks: [
    { type: 'speaking', title: 'Tell a Childhood Story', description: 'Speak for 2 minutes about a memorable childhood experience.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Listen to Story Narrations', description: 'Watch or listen to short English stories.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read a Short Story', description: 'Read aloud a simple English story with emotions and expressions.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Story Vocabulary', description: 'Learn: Adventure, Journey, Character, Incident, Mystery, Narration, Twist, Memory, Experience, Ending.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Past Continuous Practice', description: 'Practice storytelling sentences using past continuous tense.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Narrate a Funny Incident', description: 'Record yourself narrating a funny or emotional story naturally.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 38,
  title: 'Idioms & Phrases',
  description: 'Day 38: Learn commonly used English idioms and phrases to sound more natural.',
  theme: 'Idioms & Phrases',
  tasks: [
    { type: 'speaking', title: 'Use Idioms in Speech', description: 'Speak 5 sentences using common idioms naturally.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Idiom Examples', description: 'Watch a video explaining common English idioms.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Idiom Sentences', description: 'Read aloud example sentences containing idioms and phrases.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Learn Common Idioms', description: 'Learn: Break the ice, Piece of cake, Under the weather, Hit the books, Once in a blue moon, etc.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Phrase Usage Practice', description: 'Write 5 real-life situations where idioms can be used.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Natural Conversation Practice', description: 'Record yourself using idioms in casual conversation.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 39,
  title: 'Phrasal Verbs',
  description: 'Day 39: Learn useful phrasal verbs used in daily English conversations.',
  theme: 'Phrasal Verbs',
  tasks: [
    { type: 'speaking', title: 'Use Phrasal Verbs', description: 'Speak sentences using common phrasal verbs like wake up, give up, look after.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Phrasal Verb Lessons', description: 'Watch an English lesson about phrasal verbs.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Daily Conversations', description: 'Read aloud conversations containing phrasal verbs.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Phrasal Verb Vocabulary', description: 'Learn: Give up, Carry on, Look after, Turn on, Pick up, Find out, Run into, Put off, Set up, Break down.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Verb Combination Practice', description: 'Practice forming sentences using phrasal verbs correctly.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Real-Life Conversation', description: 'Record yourself using phrasal verbs naturally while speaking.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 40,
  title: 'Formal vs Informal English',
  description: 'Day 40: Learn the difference between formal and informal English communication.',
  theme: 'Formal vs Informal',
  tasks: [
    { type: 'speaking', title: 'Formal vs Casual Speaking', description: 'Practice speaking formally and informally on the same topic.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Workplace vs Friend Conversations', description: 'Observe differences between professional and casual English.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Formal and Informal Texts', description: 'Read examples of professional emails and casual chats.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Formal & Informal Vocabulary', description: 'Learn formal and informal alternatives like assist/help, purchase/buy, reside/live.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Polite Language Practice', description: 'Practice polite and respectful sentence structures.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Switch Communication Styles', description: 'Record yourself speaking formally first, then casually on the same topic.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},



{
  dayNumber: 41,
  title: 'Reading Comprehension',
  description: 'Day 41: Improve your ability to understand written English quickly and accurately.',
  theme: 'Reading Comprehension',
  tasks: [
    { type: 'speaking', title: 'Summarize a Paragraph', description: 'Read a short paragraph and explain its meaning in your own words.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Listen and Understand', description: 'Watch a short English story video and summarize it mentally.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read an Article Carefully', description: 'Read a short article aloud and identify the main idea.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Comprehension Vocabulary', description: 'Learn: Analyze, Infer, Context, Meaning, Summary, Information, Passage, Understand, Detail, Concept.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'WH-Question Practice', description: 'Answer who, what, where, when, why, and how questions from a paragraph.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Explain What You Read', description: 'Record yourself confidently explaining a paragraph you read today.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 42,
  title: 'Listening Skills',
  description: 'Day 42: Improve your English listening and understanding skills through active practice.',
  theme: 'Listening Skills',
  tasks: [
    { type: 'speaking', title: 'Repeat What You Hear', description: 'Listen to short English sentences and repeat them clearly.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch English Conversations', description: 'Watch a conversation video and focus on pronunciation and flow.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read While Listening', description: 'Read subtitles while listening to spoken English.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Listening Vocabulary', description: 'Learn: Accent, Tone, Pronunciation, Clarity, Conversation, Dialogue, Audio, Speaker, Expression, Fluency.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Sentence Recognition Practice', description: 'Identify sentence patterns while listening carefully.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Shadowing Practice', description: 'Record yourself copying the exact speaking style of a native speaker.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 43,
  title: 'Writing Skills',
  description: 'Day 43: Learn how to write clear and effective English sentences and paragraphs.',
  theme: 'Writing Skills',
  tasks: [
    { type: 'speaking', title: 'Explain Your Writing', description: 'Speak about why writing skills are important in English.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Writing Tutorials', description: 'Watch an English writing improvement video.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Good Paragraphs', description: 'Read aloud a well-written English paragraph carefully.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Writing Vocabulary', description: 'Learn: Paragraph, Sentence, Structure, Grammar, Essay, Draft, Edit, Clarity, Creativity, Content.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Sentence Structure Practice', description: 'Write simple, compound, and complex sentences.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Write and Read a Paragraph', description: 'Write a short paragraph and record yourself reading it confidently.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 44,
  title: 'Speaking Fluency',
  description: 'Day 44: Focus on speaking smoothly, confidently, and without hesitation.',
  theme: 'Speaking Fluency',
  tasks: [
    { type: 'speaking', title: 'Non-Stop Speaking Practice', description: 'Speak continuously for 2 minutes without stopping.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Fluent Speakers', description: 'Observe how fluent speakers connect words naturally.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read with Flow', description: 'Practice reading paragraphs smoothly without unnecessary pauses.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Fluency Vocabulary', description: 'Learn: Fluency, Confidence, Hesitation, Communication, Expression, Clarity, Practice, Rhythm, Natural, Smooth.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Connector Words Practice', description: 'Use connectors like because, however, therefore, meanwhile.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'One-Minute Speech', description: 'Record a confident one-minute speech on any topic.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 45,
  title: 'Grammar Mastery',
  description: 'Day 45: Strengthen your English grammar for more accurate communication.',
  theme: 'Grammar Mastery',
  tasks: [
    { type: 'speaking', title: 'Speak Grammatically Correct Sentences', description: 'Speak 10 grammatically correct sentences about daily life.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Grammar Lessons', description: 'Watch an English grammar improvement video.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Grammar Examples', description: 'Read aloud example sentences using correct grammar.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Grammar Vocabulary', description: 'Learn: Tense, Subject, Verb, Adjective, Adverb, Pronoun, Clause, Phrase, Article, Preposition.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Mixed Grammar Practice', description: 'Practice tenses, articles, prepositions, and sentence corrections.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Teach Basic Grammar', description: 'Record yourself explaining one grammar rule confidently.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},


{
  dayNumber: 46,
  title: 'Tenses Review',
  description: 'Day 46: Revise all important English tenses and improve sentence accuracy.',
  theme: 'Tenses Review',
  tasks: [
    { type: 'speaking', title: 'Speak Using Different Tenses', description: 'Speak about your past, present, and future plans using correct tenses.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Tense Lessons', description: 'Watch a revision video explaining major English tenses.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Tense Examples', description: 'Read aloud example sentences from different tenses.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Tense Vocabulary', description: 'Learn: Present, Past, Future, Continuous, Perfect, Action, Timeline, Habit, Experience, Situation.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Mixed Tense Practice', description: 'Write 10 sentences using different tenses correctly.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Life Journey Speech', description: 'Record yourself speaking about your life journey using multiple tenses.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 47,
  title: 'Articles & Prepositions',
  description: 'Day 47: Master the correct use of articles and prepositions in English.',
  theme: 'Articles & Prepositions',
  tasks: [
    { type: 'speaking', title: 'Describe Objects Correctly', description: 'Speak sentences using a, an, the, in, on, at, under, and beside correctly.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Grammar Usage Videos', description: 'Watch a lesson on articles and prepositions.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Grammar Sentences', description: 'Read aloud sentences containing common prepositions and articles.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Preposition Vocabulary', description: 'Learn: Above, Below, Across, Between, Among, Inside, Outside, During, Before, After.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Fill in the Blanks', description: 'Practice article and preposition exercises with blanks.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Describe Your Surroundings', description: 'Record yourself describing your room using correct prepositions.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 48,
  title: 'Conjunctions & Connectors',
  description: 'Day 48: Learn how to connect ideas smoothly using conjunctions and linking words.',
  theme: 'Conjunctions & Connectors',
  tasks: [
    { type: 'speaking', title: 'Connect Your Ideas', description: 'Speak using words like because, although, however, therefore, and meanwhile.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Speaking Connectors', description: 'Watch fluent English speakers using connector words naturally.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Connected Paragraphs', description: 'Read aloud paragraphs with linking words and transitions.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Connector Vocabulary', description: 'Learn: However, Therefore, Although, Moreover, Meanwhile, Consequently, Furthermore, Instead, Because, Since.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Sentence Joining Practice', description: 'Join short sentences using conjunctions correctly.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Smooth Speaking Challenge', description: 'Record yourself speaking smoothly while connecting ideas naturally.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 49,
  title: 'Reported Speech',
  description: 'Day 49: Learn how to report conversations and statements correctly in English.',
  theme: 'Reported Speech',
  tasks: [
    { type: 'speaking', title: 'Repeat Someone’s Words', description: 'Practice converting direct speech into reported speech while speaking.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Reported Speech Lessons', description: 'Watch an English lesson about direct and indirect speech.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Dialogue Conversions', description: 'Read aloud examples of direct and reported speech.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Conversation Vocabulary', description: 'Learn: Mention, Explain, Inform, Announce, Reply, Ask, Suggest, State, Whisper, Discuss.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Direct to Indirect Practice', description: 'Convert 10 direct speech sentences into reported speech.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Retell a Conversation', description: 'Record yourself explaining a conversation you had recently.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 50,
  title: 'Conditionals',
  description: 'Day 50: Learn conditional sentences to talk about possibilities, dreams, and situations.',
  theme: 'Conditionals',
  tasks: [
    { type: 'speaking', title: 'Talk About Possibilities', description: 'Speak using if sentences like: "If I improve my English, I will..."', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Conditional Lessons', description: 'Watch an English grammar lesson about conditionals.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Conditional Sentences', description: 'Read aloud examples of first, second, and third conditionals.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Conditional Vocabulary', description: 'Learn: Possibility, Situation, Decision, Choice, Imagine, Consequence, Result, Opportunity, Risk, Outcome.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'If-Clause Practice', description: 'Write 10 sentences using conditional sentence structures.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Dream Life Speech', description: 'Record yourself speaking about your dream future using conditionals.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 51,
  title: 'Advanced Vocabulary',
  description: 'Day 51: Learn advanced English vocabulary to sound more confident and expressive.',
  theme: 'Advanced Vocabulary',
  tasks: [
    { type: 'speaking', title: 'Use Advanced Words', description: 'Speak for 2 minutes using at least 5 advanced English words naturally.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Advanced English Videos', description: 'Watch fluent English speakers and note powerful vocabulary words.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Advanced Articles', description: 'Read aloud an article containing advanced English words.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Advanced Word List', description: 'Learn: Exceptional, Remarkable, Significant, Perspective, Efficient, Ambitious, Determined, Complicated, Influence, Achievement.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Advanced Sentence Formation', description: 'Write 5 strong and professional sentences using advanced vocabulary.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Motivational Speech', description: 'Record yourself giving a motivational speech using advanced vocabulary confidently.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 52,
  title: 'Public Speaking',
  description: 'Day 52: Improve your confidence and communication through public speaking practice.',
  theme: 'Public Speaking',
  tasks: [
    { type: 'speaking', title: 'Give a Short Speech', description: 'Speak for 2 minutes on any motivational or educational topic.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Public Speakers', description: 'Watch a famous speech or TED Talk in English.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read a Speech Aloud', description: 'Read aloud a famous speech with proper emotion and pauses.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Public Speaking Vocabulary', description: 'Learn: Audience, Confidence, Gesture, Expression, Stage, Communication, Inspire, Impact, Voice, Presentation.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Persuasive Sentence Practice', description: 'Practice persuasive and impactful sentence structures.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Camera Speaking Challenge', description: 'Record yourself speaking confidently while maintaining eye contact with the camera.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 53,
  title: 'Confidence Building',
  description: 'Day 53: Build strong self-confidence while communicating in English.',
  theme: 'Confidence Building',
  tasks: [
    { type: 'speaking', title: 'Positive Self-Talk', description: 'Speak positive affirmations in English confidently.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Confidence Videos', description: 'Watch motivational English videos about confidence.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Motivational Quotes', description: 'Read aloud powerful motivational quotes confidently.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Confidence Vocabulary', description: 'Learn: Courage, Fearless, Motivation, Self-esteem, Determination, Boldness, Positivity, Improvement, Strength, Focus.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Affirmation Sentence Practice', description: 'Write positive affirmation sentences in English.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Mirror Speaking Practice', description: 'Record yourself speaking confidently in front of a mirror.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 54,
  title: 'Real Conversations',
  description: 'Day 54: Practice real-life English conversations naturally and confidently.',
  theme: 'Real Conversations',
  tasks: [
    { type: 'speaking', title: 'Daily Conversation Practice', description: 'Speak naturally about your day as if talking to a friend.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Real-Life Conversations', description: 'Watch casual real-life English conversations.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Conversation Scripts', description: 'Read aloud practical daily conversation examples.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Conversation Vocabulary', description: 'Learn: Actually, Basically, Honestly, Anyway, Definitely, Probably, Seriously, Absolutely, Exactly, Naturally.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Natural Sentence Practice', description: 'Practice making natural conversational sentences.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Conversation Simulation', description: 'Record yourself having a full imaginary conversation in English.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 55,
  title: 'Mock Interviews',
  description: 'Day 55: Practice complete mock interviews in English to prepare for real opportunities.',
  theme: 'Mock Interviews',
  tasks: [
    { type: 'speaking', title: 'Interview Question Practice', description: 'Answer common HR interview questions confidently.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Mock Interview Sessions', description: 'Watch English mock interview examples carefully.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Professional Answers', description: 'Read aloud professional interview responses clearly.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Professional Vocabulary', description: 'Learn: Leadership, Responsibility, Teamwork, Experience, Goal-oriented, Flexible, Productivity, Skillset, Professionalism, Achievement.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Professional Communication Practice', description: 'Practice formal and grammatically correct interview responses.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Full Mock Interview Recording', description: 'Record yourself answering multiple interview questions professionally.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},



{
  dayNumber: 56,
  title: 'Group Discussion',
  description: 'Day 56: Learn how to participate actively and confidently in English group discussions.',
  theme: 'Group Discussion',
  tasks: [
    { type: 'speaking', title: 'Share Your Opinion', description: 'Speak for 2 minutes on a trending topic as if in a group discussion.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Group Discussions', description: 'Watch English GD sessions and observe how participants communicate.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Discussion Topics', description: 'Read aloud sample group discussion topics and points.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Discussion Vocabulary', description: 'Learn: Opinion, Perspective, Argument, Leadership, Collaboration, Suggestion, Discussion, Interaction, Participation, Communication.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Opinion & Agreement Practice', description: 'Practice sentences like: "I agree with...", "In my opinion..."', xp: 15, duration: 10 },
    { type: 'confidence', title: 'GD Simulation', description: 'Record yourself speaking as if participating in a real group discussion.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 57,
  title: 'Debate Practice',
  description: 'Day 57: Improve critical thinking and speaking confidence through debate practice.',
  theme: 'Debate Practice',
  tasks: [
    { type: 'speaking', title: 'Support or Oppose a Topic', description: 'Choose a topic and speak for or against it confidently.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch English Debates', description: 'Watch simple English debate competitions or discussions.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Debate Arguments', description: 'Read aloud arguments supporting different viewpoints.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Debate Vocabulary', description: 'Learn: Argument, Counterpoint, Evidence, Justify, Convince, Opinion, Statement, Perspective, Conclusion, Reasoning.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Persuasive Language Practice', description: 'Practice persuasive sentences and logical connectors.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Debate Recording Challenge', description: 'Record yourself confidently presenting strong arguments on a topic.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 58,
  title: 'Final Review',
  description: 'Day 58: Review everything you have learned throughout your English journey so far.',
  theme: 'Final Review',
  tasks: [
    { type: 'speaking', title: 'Review Your Progress', description: 'Speak about your English learning journey and improvements.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Rewatch Your Old Recordings', description: 'Listen to your older speaking recordings and compare your improvement.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Your Favorite Lessons', description: 'Read aloud your favorite paragraphs or lessons from previous days.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Vocabulary Revision', description: 'Revise important vocabulary words learned in the past 57 days.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Grammar Revision', description: 'Review all important grammar concepts and write example sentences.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Speak Without Fear', description: 'Record yourself speaking freely in English for one full minute without stopping.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 59,
  title: 'Celebration Day',
  description: 'Day 59: Celebrate your consistency, confidence, and progress in English communication.',
  theme: 'Celebration Day',
  tasks: [
    { type: 'speaking', title: 'Celebrate Your Journey', description: 'Speak proudly about how far you have come in 59 days.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Watch Motivational Speeches', description: 'Watch a motivational English speech to inspire yourself.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Inspirational Quotes', description: 'Read aloud powerful motivational quotes with emotion.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Success Vocabulary', description: 'Learn: Achievement, Consistency, Growth, Discipline, Success, Progress, Confidence, Improvement, Motivation, Excellence.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Reflection Writing Practice', description: 'Write 5 sentences about what you achieved during this challenge.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Thank Yourself Message', description: 'Record a positive message thanking yourself for not giving up.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

{
  dayNumber: 60,
  title: 'Champion Day',
  description: 'Day 60: Congratulations! You completed the full English challenge and became stronger, more confident, and more fluent.',
  theme: 'Champion Day',
  tasks: [
    { type: 'speaking', title: 'Champion Speech', description: 'Give a final 2-minute speech about your complete English transformation journey.', xp: 20, duration: 2, hasTimer: true, hasRecording: true },
    { type: 'listening', title: 'Listen to Your First Recording', description: 'Compare your Day 1 and Day 60 speaking recordings.', xp: 15, duration: 5 },
    { type: 'reading', title: 'Read Your Favorite Paragraph', description: 'Read your favorite English paragraph fluently and confidently.', xp: 15, duration: 5, hasTimer: true },
    { type: 'vocabulary', title: 'Champion Vocabulary', description: 'Learn: Mastery, Champion, Excellence, Fluency, Confidence, Victory, Achievement, Dedication, Persistence, Success.', xp: 20, duration: 10 },
    { type: 'grammar', title: 'Final Grammar Challenge', description: 'Write a paragraph using correct grammar, connectors, and advanced vocabulary.', xp: 15, duration: 10 },
    { type: 'confidence', title: 'Final Transformation Video', description: 'Record a final video sharing your 60-day English journey and achievements.', xp: 25, duration: 3, hasTimer: true, hasRecording: true },
  ],
},

];

const vocabularyData = [
  { word: 'Confident', meaning: 'Feeling sure about yourself', hindiMeaning: 'आत्मविश्वासी', pronunciation: 'KON-fi-dent', exampleSentence: 'She is confident about her English skills.', dayNumber: 1, difficulty: 'beginner' },
  { word: 'Fluent', meaning: 'Able to speak smoothly and easily', hindiMeaning: 'धाराप्रवाह', pronunciation: 'FLOO-ent', exampleSentence: 'He speaks fluent English.', dayNumber: 1, difficulty: 'beginner' },
  { word: 'Practice', meaning: 'To do something repeatedly to improve', hindiMeaning: 'अभ्यास', pronunciation: 'PRAK-tis', exampleSentence: 'Daily practice makes you better.', dayNumber: 1, difficulty: 'beginner' },
  { word: 'Improve', meaning: 'To make something better', hindiMeaning: 'सुधारना', pronunciation: 'im-PROOV', exampleSentence: 'I want to improve my English.', dayNumber: 2, difficulty: 'beginner' },
  { word: 'Achieve', meaning: 'To successfully reach a goal', hindiMeaning: 'हासिल करना', pronunciation: 'a-CHEEV', exampleSentence: 'You can achieve anything with hard work.', dayNumber: 2, difficulty: 'beginner' },
  { word: 'Determination', meaning: 'Strong will to do something', hindiMeaning: 'दृढ़ संकल्प', pronunciation: 'di-ter-mi-NAY-shun', exampleSentence: 'Her determination helped her succeed.', dayNumber: 3, difficulty: 'intermediate' },
  { word: 'Vocabulary', meaning: 'All the words a person knows', hindiMeaning: 'शब्द भंडार', pronunciation: 'vo-KAB-yoo-ler-ee', exampleSentence: 'Building vocabulary is important.', dayNumber: 3, difficulty: 'beginner' },
  { word: 'Pronunciation', meaning: 'The way a word is spoken', hindiMeaning: 'उच्चारण', pronunciation: 'pro-nun-see-AY-shun', exampleSentence: 'Good pronunciation helps communication.', dayNumber: 4, difficulty: 'intermediate' },
  { word: 'Communicate', meaning: 'To share information with others', hindiMeaning: 'संवाद करना', pronunciation: 'ko-MYOO-ni-kayt', exampleSentence: 'We communicate in English at work.', dayNumber: 4, difficulty: 'beginner' },
  { word: 'Opportunity', meaning: 'A chance to do something', hindiMeaning: 'अवसर', pronunciation: 'op-er-TOO-ni-tee', exampleSentence: 'English opens many opportunities.', dayNumber: 5, difficulty: 'intermediate' },
  { word: 'Midnight', meaning: 'Twelve o clock at night', hindiMeaning: 'आधी रात', pronunciation: 'MID-nyt', exampleSentence: 'The clock struck midnight.', dayNumber: 6, difficulty: 'beginner' },
  { word: 'Deadline', meaning: 'The latest time to finish something', hindiMeaning: 'अंतिम समय सीमा', pronunciation: 'DED-lyn', exampleSentence: 'Submit your work before the deadline.', dayNumber: 6, difficulty: 'beginner' },
  { word: 'Punctual', meaning: 'Arriving exactly on time', hindiMeaning: 'समय का पाबंद', pronunciation: 'PUNK-choo-ul', exampleSentence: 'She is always punctual to class.', dayNumber: 6, difficulty: 'intermediate' },
  { word: 'Transparent', meaning: 'Clear, able to be seen through', hindiMeaning: 'पारदर्शी', pronunciation: 'trans-PAIR-ent', exampleSentence: 'The glass is transparent.', dayNumber: 7, difficulty: 'intermediate' },
  { word: 'Fragile', meaning: 'Easily broken or damaged', hindiMeaning: 'नाज़ुक', pronunciation: 'FRAJ-ul', exampleSentence: 'Handle the fragile vase carefully.', dayNumber: 7, difficulty: 'intermediate' },
  { word: 'Enormous', meaning: 'Very large in size', hindiMeaning: 'विशाल', pronunciation: 'i-NOR-mus', exampleSentence: 'The elephant is enormous.', dayNumber: 7, difficulty: 'beginner' },
  { word: 'Sibling', meaning: 'A brother or sister', hindiMeaning: 'भाई-बहन', pronunciation: 'SIB-ling', exampleSentence: 'I have two siblings.', dayNumber: 8, difficulty: 'beginner' },
  { word: 'Ancestor', meaning: 'A family member from the past', hindiMeaning: 'पूर्वज', pronunciation: 'AN-ses-ter', exampleSentence: 'Our ancestors were farmers.', dayNumber: 8, difficulty: 'intermediate' },
  { word: 'Guardian', meaning: 'A person who protects or takes care', hindiMeaning: 'अभिभावक', pronunciation: 'GAR-dee-un', exampleSentence: 'His uncle is his legal guardian.', dayNumber: 8, difficulty: 'intermediate' },
  { word: 'Savory', meaning: 'Tasty, salty or spicy not sweet', hindiMeaning: 'नमकीन/स्वादिष्ट', pronunciation: 'SAY-vuh-ree', exampleSentence: 'I prefer savory snacks over sweets.', dayNumber: 9, difficulty: 'intermediate' },
  { word: 'Cuisine', meaning: 'A style of cooking from a region', hindiMeaning: 'खान-पान शैली', pronunciation: 'kwi-ZEEN', exampleSentence: 'I love Indian cuisine.', dayNumber: 9, difficulty: 'intermediate' },
  { word: 'Appetizer', meaning: 'A small dish served before the main meal', hindiMeaning: 'भोजन से पहले का नाश्ता', pronunciation: 'AP-uh-ty-zer', exampleSentence: 'We had soup as an appetizer.', dayNumber: 9, difficulty: 'beginner' },
  { word: 'Commute', meaning: 'Travel regularly to and from work', hindiMeaning: 'आना-जाना', pronunciation: 'kuh-MYOOT', exampleSentence: 'My daily commute takes 30 minutes.', dayNumber: 10, difficulty: 'intermediate' },
  { word: 'Productive', meaning: 'Achieving a lot in a given time', hindiMeaning: 'उत्पादक', pronunciation: 'pruh-DUK-tiv', exampleSentence: 'I had a very productive morning.', dayNumber: 10, difficulty: 'intermediate' },
  { word: 'Consistent', meaning: 'Doing something regularly without stopping', hindiMeaning: 'निरंतर', pronunciation: 'kun-SIS-tent', exampleSentence: 'Be consistent in your English practice.', dayNumber: 10, difficulty: 'intermediate' },
];

const quotesData = [
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  { text: 'Every day is a new opportunity to improve yourself.', author: 'Unknown' },
  { text: 'You don\'t have to be great to start, but you have to start to be great.', author: 'Zig Ziglar' },
  { text: 'Small daily improvements lead to stunning results.', author: 'Robin Sharma' },
  { text: 'The more you practice, the luckier you get.', author: 'Gary Player' },
  { text: 'Believe you can and you\'re halfway there.', author: 'Theodore Roosevelt' },
  { text: 'Success is the sum of small efforts repeated day in and day out.', author: 'Robert Collier' },
  { text: 'Don\'t watch the clock; do what it does. Keep going.', author: 'Sam Levenson' },
  { text: 'Your English journey starts with a single word.', author: 'Every Day Better' },
  { text: 'Mistakes are proof that you are trying.', author: 'Unknown' },
  { text: 'Fluency comes from consistency, not perfection.', author: 'Every Day Better' },
  { text: 'Speak even if your voice shakes. That\'s courage.', author: 'Unknown' },
  { text: 'Language is the road map of a culture.', author: 'Rita Mae Brown' },
  { text: 'To learn a language is to have one more window from which to look at the world.', author: 'Chinese Proverb' },
  { text: 'The limits of my language mean the limits of my world.', author: 'Ludwig Wittgenstein' },
  { text: 'One language sets you in a corridor for life. Two languages open every door along the way.', author: 'Frank Smith' },
  { text: 'You are never too old to learn a new language.', author: 'Unknown' },
  { text: 'Every accomplishment starts with the decision to try.', author: 'John F. Kennedy' },
  { text: 'Push yourself because no one else is going to do it for you.', author: 'Unknown' },
  { text: 'Great things never come from comfort zones.', author: 'Unknown' },
  { text: 'Dream it. Wish it. Do it.', author: 'Unknown' },
  { text: 'The harder you work for something, the greater you will feel when you achieve it.', author: 'Unknown' },
];

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected successfully.');

    // --- Days: idempotent bulkWrite upsert (safe to run multiple times) ---
    const dayOps = daysData.map((d) => ({
      updateOne: {
        filter: { dayNumber: d.dayNumber },
        update: { $set: enrichDay(d) },
        upsert: true,
      },
    }));
    console.log(`📦 Seeding ${dayOps.length} days...`);
    const dayResult = await Day.bulkWrite(dayOps);
    console.log(`   ✅ Days — matched: ${dayResult.matchedCount}, upserted: ${dayResult.upsertedCount}`);

    // --- Vocabulary: upsert by word ---
    const vocabOps = vocabularyData.map((v) => ({
      updateOne: {
        filter: { word: v.word },
        update: { $set: v },
        upsert: true,
      },
    }));
    console.log(`📦 Seeding ${vocabOps.length} vocabulary words...`);
    const vocabResult = await Vocabulary.bulkWrite(vocabOps);
    console.log(`   ✅ Vocabulary — matched: ${vocabResult.matchedCount}, upserted: ${vocabResult.upsertedCount}`);

    // --- Quotes: upsert by text ---
    const quoteOps = quotesData.map((q) => ({
      updateOne: {
        filter: { text: q.text },
        update: { $set: q },
        upsert: true,
      },
    }));
    console.log(`📦 Seeding ${quoteOps.length} quotes...`);
    const quoteResult = await Quote.bulkWrite(quoteOps);
    console.log(`   ✅ Quotes — matched: ${quoteResult.matchedCount}, upserted: ${quoteResult.upsertedCount}`);

    // --- Admin user: only create if not exists ---
    const adminPass = process.env.ADMIN_SEED_PASSWORD || 'admin123';
    const existing = await User.findOne({ email: 'admin@everydaybetter.com' });
    if (!existing) {
      await User.create({
        name: 'Admin',
        email: 'admin@everydaybetter.com',
        password: await bcrypt.hash(adminPass, 12),
        role: 'admin',
      });
      console.log('   ✅ Admin user created.');
    } else {
      console.log('   ℹ️  Admin user already exists — skipped.');
    }

    console.log('\n🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Critical error during seeding:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed.');
    process.exit(0);
  }
};

seedDatabase();
