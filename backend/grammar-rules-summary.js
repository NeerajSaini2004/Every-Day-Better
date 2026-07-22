// Quick validation and summary of grammar rules
const grammarData = [
  // PRESENT TENSE (9 rules)
  { title: 'Present Simple - Formation', category: 'present-simple' },
  { title: 'Present Simple - Usage', category: 'present-simple' },
  { title: 'Present Simple - Common Mistakes', category: 'present-simple' },
  { title: 'Present Continuous - Formation', category: 'present-continuous' },
  { title: 'Present Continuous - Usage', category: 'present-continuous' },
  { title: 'Present Continuous - Common Mistakes', category: 'present-continuous' },
  { title: 'Present Perfect - Formation', category: 'present-perfect' },
  { title: 'Present Perfect - Usage', category: 'present-perfect' },
  { title: 'Present Perfect Continuous - Formation', category: 'present-perfect-continuous' },
  
  // PAST TENSE (9 rules)
  { title: 'Past Simple - Formation', category: 'past-simple' },
  { title: 'Past Simple - Usage', category: 'past-simple' },
  { title: 'Past Simple - Common Mistakes', category: 'past-simple' },
  { title: 'Past Continuous - Formation', category: 'past-continuous' },
  { title: 'Past Continuous - Usage', category: 'past-continuous' },
  { title: 'Past Perfect - Formation', category: 'past-perfect' },
  { title: 'Past Perfect - Usage', category: 'past-perfect' },
  { title: 'Past Perfect Continuous - Formation', category: 'past-perfect-continuous' },
  
  // FUTURE TENSE (9 rules)
  { title: 'Future Simple - Formation', category: 'future-simple' },
  { title: 'Future Simple - Usage', category: 'future-simple' },
  { title: 'Future Continuous - Formation', category: 'future-continuous' },
  { title: 'Future Continuous - Usage', category: 'future-continuous' },
  { title: 'Future Perfect - Formation', category: 'future-perfect' },
  { title: 'Future Perfect - Usage', category: 'future-perfect' },
  { title: 'Future Perfect Continuous - Formation', category: 'future-perfect-continuous' },
  
  // FUNDAMENTALS (20 rules)
  { title: 'Articles - Indefinite (A/An)', category: 'articles' },
  { title: 'Articles - Definite (The)', category: 'articles' },
  { title: 'Articles - Zero Article (No Article)', category: 'articles' },
  { title: 'Prepositions - In/On/At (Place)', category: 'prepositions' },
  { title: 'Prepositions - In/On/At (Time)', category: 'prepositions' },
  { title: 'Prepositions - Other Common Uses', category: 'prepositions' },
  { title: 'Conjunctions - Coordinating (And, But, Or)', category: 'conjunctions' },
  { title: 'Conjunctions - Subordinating (Because, If, When, While)', category: 'conjunctions' },
  { title: 'Modal Verbs - Can/Could', category: 'modal-verbs' },
  { title: 'Modal Verbs - Should/Must', category: 'modal-verbs' },
  { title: 'Modal Verbs - May/Might', category: 'modal-verbs' },
  { title: 'Subject-Verb Agreement - Singular/Plural', category: 'subject-verb-agreement' },
  { title: 'Subject-Verb Agreement - Collective Nouns', category: 'subject-verb-agreement' },
  { title: 'Word Order - Basic SVO (Subject-Verb-Object)', category: 'word-order' },
  { title: 'Word Order - Adjectives Before Nouns', category: 'word-order' },
  { title: 'Nouns - Countable and Uncountable', category: 'parts-of-speech' },
  { title: 'Verbs - Transitive and Intransitive', category: 'parts-of-speech' },
  { title: 'Adjectives - Comparison (Comparative and Superlative)', category: 'parts-of-speech' },
  { title: 'Conditional - Zero Conditional (General Truth)', category: 'conditionals' },
  { title: 'Conditional - First Conditional (Possible Future)', category: 'conditionals' },
  { title: 'Conditional - Second Conditional (Imaginary)', category: 'conditionals' },
  { title: 'Conditional - Third Conditional (Past Regret)', category: 'conditionals' },
  { title: 'Passive Voice - Formation', category: 'passive-voice' },
  { title: 'Passive Voice - When to Use', category: 'passive-voice' },
  { title: 'Reported Speech - Simple Present to Past', category: 'reported-speech' },
  { title: 'Reported Speech - Questions', category: 'reported-speech' },
  { title: 'Gerunds vs Infinitives - Gerunds (Verb + ing)', category: 'gerunds-infinitives' },
  { title: 'Gerunds vs Infinitives - Infinitives (to + Verb)', category: 'gerunds-infinitives' },
  { title: 'Relative Clauses - Who/That/Which', category: 'relative-clauses' },
  { title: 'Relative Clauses - Where/When/Why', category: 'relative-clauses' },
  { title: 'Adverbs - Formation and Types', category: 'adverbs' },
  { title: 'Adverbs - Position in Sentence', category: 'adverbs' },
];

// Count by category
const categories = {};
grammarData.forEach(rule => {
  categories[rule.category] = (categories[rule.category] || 0) + 1;
});

console.log('========== GRAMMAR RULES SUMMARY ==========');
console.log(`Total Rules: ${grammarData.length}\n`);
console.log('Breakdown by Category:');
Object.entries(categories).sort().forEach(([category, count]) => {
  console.log(`  ${category}: ${count} rules`);
});

const tenseRules = Object.entries(categories)
  .filter(([cat]) => cat.includes('present') || cat.includes('past') || cat.includes('future'))
  .reduce((sum, [_, count]) => sum + count, 0);

const fundamentalRules = grammarData.length - tenseRules;

console.log(`\nTense Rules: ${tenseRules}`);
console.log(`Fundamental Rules: ${fundamentalRules}`);
console.log('========================================\n');
