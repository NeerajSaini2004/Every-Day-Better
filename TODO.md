# TODO — UX Updates Implementation

- [x] Create unified “Next action” module UI and reuse it across Dashboard, DayChallenge, and DailyChallenge
- [x] Update Onboarding to a stepper that maps selections to user preferences (and keeps flow consistent)
- [x] Improve Speaking page into a clearer state-machine UI (permission/listen/record/playback)
- [ ] Standardize TaskCard UX: consistent primary CTA, tooltips/microcopy, and consistent completion UI
- [ ] Add Progress “insights tiles” above charts (streak, XP, tasks done, next milestone)
- [ ] Ensure BottomNav + routing respects onboarding state consistently
- [x] Backend alignment: verify endpoints return fields needed for UI state (no frontend guessing)
- [x] Test build/lint and run basic smoke checks (Production webpack build succeeded: 297 kB gzip)
- [x] Security: Google OAuth server-side ID token verification (google-auth-library)
- [x] Security: Per-user AI rate & burst limiting (aiRateLimit middleware)
- [x] Security: Explicit SEED_SECRET enforcement on /api/run-seed
- [x] Security: Password reset emails via nodemailer with safe dev fallback
- [x] Security: Centralized input validation via express-validator
- [x] Legal & UX: Dedicated Terms of Service and Privacy Policy pages added to routing
- [x] Testing: Automated backend test suite with Jest + Supertest (11/11 tests passing)
- [x] Architecture: Extracted speaking datasets into data/speakingData.js
- [x] UX: Resilient loading and error retry states in Dashboard, Progress, and Leaderboard
- [x] SEO & PWA: Open Graph / Twitter Card social previews and branded manifest.json
- [x] Performance: Code splitting via React.lazy dropped initial bundle by 65% (298 kB -> 103 kB)
- [x] Backend: Added structured pagination support to /api/vocabulary and /api/users/leaderboard

