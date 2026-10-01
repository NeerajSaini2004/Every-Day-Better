export const BADGES = {
  first_day: { label: 'First Step', icon: '🌱', color: 'text-green-400 bg-green-400/10' },
  week_warrior: { label: 'Week Warrior', icon: '⚔️', color: 'text-blue-400 bg-blue-400/10' },
  month_master: { label: 'Month Master', icon: '🏆', color: 'text-yellow-400 bg-yellow-400/10' },
  champion: { label: 'Champion', icon: '👑', color: 'text-purple-400 bg-purple-400/10' },
  streak_7: { label: '7-Day Streak', icon: '🔥', color: 'text-orange-400 bg-orange-400/10' },
};

export const TASK_ICONS = {
  speaking: '🎤',
  listening: '👂',
  reading: '📖',
  vocabulary: '📝',
  grammar: '✏️',
  confidence: '💪',
};

export const TASK_COLORS = {
  speaking: 'blue',
  listening: 'purple',
  reading: 'green',
  vocabulary: 'yellow',
  grammar: 'pink',
  confidence: 'orange',
};

export const isUnlocked = (dayNumber, user) =>
  user?.role === 'admin' || dayNumber === 1 || (user?.completedDays || []).includes(dayNumber - 1) || dayNumber <= ((user?.completedDays || []).length + 1);

export const LEVEL_NAMES = ['Beginner', 'Explorer', 'Learner', 'Speaker', 'Communicator', 'Fluent', 'Advanced', 'Expert', 'Master', 'Champion'];

export const getLevelName = (level) => LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];
export const getXPForNextLevel = (level) => level * 500;
export const getXPProgress = (xp, level) => {
  const levelStartXP = (level - 1) * 500;
  return Math.min(Math.max(((xp - levelStartXP) / 500) * 100, 0), 100);
};
