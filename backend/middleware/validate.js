const { body, param, validationResult } = require('express-validator');

// Middleware: run after validators to surface errors
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errors.array()[0].msg,
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

// ── Auth ─────────────────────────────────────────────
const registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  handleValidation,
];

const loginRules = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation,
];

const forgotPasswordRules = [
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  handleValidation,
];

const resetPasswordRules = [
  param('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  handleValidation,
];

const onboardingRules = [
  body('englishLevel').isIn(['beginner', 'basic', 'intermediate']).withMessage('Invalid English level'),
  body('goal').isIn(['job', 'exam', 'speaking', 'general']).withMessage('Invalid goal'),
  body('dailyTime').isInt({ min: 5, max: 120 }).withMessage('Daily time must be between 5 and 120 minutes'),
  handleValidation,
];

const googleAuthRules = [
  body('credential').notEmpty().withMessage('Google credential token is required'),
  handleValidation,
];

// ── Progress ─────────────────────────────────────────
const taskUpdateRules = [
  param('dayNumber').isInt({ min: 1, max: 60 }).withMessage('Invalid day number'),
  param('taskId').isMongoId().withMessage('Invalid task ID'),
  body('completed').isBoolean().withMessage('completed must be a boolean'),
  handleValidation,
];

// ── Challenge ────────────────────────────────────────
const challengeSubmitRules = [
  body('challengeId').isMongoId().withMessage('Invalid challenge ID'),
  body('selectedIndex').isInt({ min: 0, max: 3 }).withMessage('Invalid selected index'),
  handleValidation,
];

const srsAddRules = [
  body('wordId').isMongoId().withMessage('Invalid word ID'),
  handleValidation,
];

const srsReviewRules = [
  body('srsId').isMongoId().withMessage('Invalid SRS ID'),
  body('quality').isInt({ min: 0, max: 2 }).withMessage('Quality must be 0, 1, or 2'),
  handleValidation,
];

// ── Users ────────────────────────────────────────────
const profileUpdateRules = [
  body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
  handleValidation,
];

const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  handleValidation,
];

// ── AI routes ────────────────────────────────────────
const aiChatRules = [
  body('messages').isArray({ min: 1 }).withMessage('At least one message is required'),
  body('messages.*.role').isIn(['user', 'assistant', 'system']).withMessage('Invalid message role'),
  body('messages.*.content').isString().isLength({ max: 4000 }).withMessage('Message content too long (max 4000 chars)'),
  handleValidation,
];

module.exports = {
  handleValidation,
  registerRules,
  loginRules,
  forgotPasswordRules,
  resetPasswordRules,
  onboardingRules,
  googleAuthRules,
  taskUpdateRules,
  challengeSubmitRules,
  srsAddRules,
  srsReviewRules,
  profileUpdateRules,
  changePasswordRules,
  aiChatRules,
};
