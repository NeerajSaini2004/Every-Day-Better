# Every Day Better 📚
### Improve Your English in 60 Days

A full-stack MERN application — gamified English learning tracker inspired by Striver A2Z Sheet + Duolingo.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Backend Setup
```bash
cd backend
npm install
# Edit .env — set your MONGO_URI
npm run dev        # runs on http://localhost:5000
```

### 2. Seed Database
```bash
cd backend
node seed/seedData.js
# Creates 60 days, vocabulary, quotes, and admin user
# Admin: admin@everydaybetter.com / admin123
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start          # runs on http://localhost:3000
```

---

## 🗂️ Project Structure

```
every-day-better/
├── backend/
│   ├── models/          # User, Day, Progress, Vocabulary, Quote
│   ├── routes/          # auth, users, days, progress, vocabulary, admin
│   ├── middleware/       # JWT auth, admin guard
│   ├── seed/            # seedData.js — 60 days + vocab + quotes
│   └── server.js
└── frontend/
    └── src/
        ├── context/     # AuthContext, ThemeContext
        ├── hooks/       # useTimer, useRecorder
        ├── pages/       # Home, Dashboard, DayChallenge, Progress, Vocabulary, Speaking, Leaderboard, Profile, Admin
        ├── components/
        │   ├── layout/  # Navbar, BottomNav, Layout
        │   └── ui/      # DayCard, TaskCard, VocabCard, ProgressBar, StatsBar, BadgeCard
        └── utils/       # api.js (axios), constants.js
```

---

## 🎯 Features

| Feature | Status |
|---|---|
| 60-Day Challenge Dashboard | ✅ |
| Daily Task System (6 task types) | ✅ |
| XP & Level System | ✅ |
| Streak Tracking | ✅ |
| Voice Recording | ✅ |
| Speaking Timer | ✅ |
| Vocabulary with Hindi Meanings | ✅ |
| Text-to-Speech Pronunciation | ✅ |
| Progress Charts (Recharts) | ✅ |
| Achievement Badges | ✅ |
| Leaderboard | ✅ |
| Dark Mode | ✅ |
| Mobile-First + Bottom Nav | ✅ |
| Admin Panel | ✅ |
| JWT Authentication | ✅ |

---

## 🗄️ Database Schema

### User
```
name, email, password, xp, level, streak, longestStreak,
completedDays[], badges[], totalTasksCompleted, lastActiveDate, role
```

### Day
```
dayNumber, title, description, weekNumber, theme, totalXP,
tasks[]: { type, title, description, xp, duration, hasTimer, hasRecording }
```

### Progress
```
user (ref), day (ref), dayNumber, tasks[], completionPercentage,
totalXPEarned, isCompleted, startedAt, completedAt
```

### Vocabulary
```
word, meaning, hindiMeaning, pronunciation, exampleSentence,
dayNumber, difficulty, category
```

---

## 🔑 API Endpoints

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/users/profile
GET    /api/users/leaderboard
POST   /api/users/streak
GET    /api/days
GET    /api/days/:dayNumber
GET    /api/progress
GET    /api/progress/:dayNumber
PUT    /api/progress/:dayNumber/task/:taskId
GET    /api/vocabulary
GET    /api/vocabulary/daily-quote
GET    /api/admin/stats          (admin only)
GET    /api/admin/users          (admin only)
POST   /api/admin/quotes         (admin only)
POST   /api/admin/vocabulary     (admin only)
```

---

## 🎨 Tech Stack

- **Frontend**: React 18, Tailwind CSS 3, React Router v6, Recharts, Framer Motion, React Hot Toast, Lucide Icons
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs
- **Features**: Web Speech API (TTS), MediaRecorder API (voice recording)
