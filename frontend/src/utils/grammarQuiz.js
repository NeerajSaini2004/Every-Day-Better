// Generates a quiz question from a grammar rule
// No backend needed — derives questions from existing rule data

export function generateQuiz(rule) {
  const quizzes = [];

  // Quiz 1: Fill in the blank from exampleSentence
  if (rule.exampleSentence) {
    const words = rule.exampleSentence.replace(/[.,!?]/g, '').split(' ');
    // Pick a meaningful word (not short words like I, a, the)
    const candidates = words.filter((w) => w.length > 3);
    if (candidates.length > 0) {
      const target = candidates[Math.floor(candidates.length / 2)];
      const blanked = rule.exampleSentence.replace(target, '_____');
      const wrongs = getWrongOptions(target, rule);
      if (wrongs.length >= 3) {
        quizzes.push({
          type: 'fill',
          question: `Fill in the blank: "${blanked}"`,
          correct: target,
          options: shuffle([target, ...wrongs.slice(0, 3)]),
          explanation: `Correct answer is "${target}". ${rule.rule}`,
        });
      }
    }
  }

  // Quiz 2: Identify correct sentence from examples (wrong vs right)
  const wrongExample = rule.examples?.find((e) => e.startsWith('WRONG:'));
  const rightExample = rule.examples?.find((e) => e.startsWith('RIGHT:'));
  if (wrongExample && rightExample) {
    const wrong = wrongExample.replace('WRONG:', '').trim();
    const right = rightExample.replace('RIGHT:', '').trim();
    quizzes.push({
      type: 'correct',
      question: 'Which sentence is grammatically correct?',
      correct: right,
      options: shuffle([right, wrong]),
      explanation: `"${right}" is correct. ${rule.rule}`,
    });
  }

  // Quiz 3: Category/rule identification
  if (rule.examples?.length >= 2) {
    quizzes.push({
      type: 'identify',
      question: `Which rule does this sentence follow?\n"${rule.exampleSentence || rule.examples[0]}"`,
      correct: rule.title,
      options: shuffle([rule.title, ...getCategoryDecoys(rule.category)]),
      explanation: `This follows the "${rule.title}" rule. ${rule.rule}`,
    });
  }

  return quizzes[0] || null;
}

function getWrongOptions(correct, rule) {
  const pool = [
    // Common wrong substitutions
    correct + 's', correct + 'ed', correct + 'ing',
    correct.replace(/s$/, ''), correct.replace(/ed$/, ''),
    'is', 'are', 'was', 'were', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'should',
    'a', 'an', 'the', 'in', 'on', 'at',
  ].filter((w) => w !== correct && w.length > 0);

  return [...new Set(pool)].slice(0, 3);
}

function getCategoryDecoys(category) {
  const all = [
    'Present Simple - Formation',
    'Past Simple - Usage',
    'Future Simple - Formation',
    'Articles - Definite (The)',
    'Modal Verbs - Can/Could',
    'Passive Voice - Formation',
    'Reported Speech - Questions',
    'Subject-Verb Agreement',
    'Conjunctions - Coordinating',
    'Prepositions - In/On/At (Time)',
  ];
  return all.filter((t) => !t.toLowerCase().includes(category.split('-')[0])).slice(0, 3);
}

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}
