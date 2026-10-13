# 🌿 Find Your Balance — Daily Planner & Wellness Journal

[![React](https://img.shields.io/badge/React-19.2-61dafb?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v3-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8e75ff?logo=google&logoColor=white)](https://ai.google.dev/)

> **A holistic, aesthetic digital journal and planner designed to harmonize daily productivity, habit cultivation, mindful reflection, and personal growth.**

---

## ✨ Overview

**Find Your Balance** is an interactive, paper-textured digital planner that brings mindfulness into everyday task management. Rather than treating your day as an endless to-do list, the app encourages balanced living across **Work**, **Family**, and **Self-Care**.

Built with a handwritten aesthetic, soothing ambient backgrounds, and an AI-powered wellness companion, it helps you set daily intentions, build steady habits, log emotional wellness, and gain insights into your personal life balance.

---

## 🚀 Key Features

### 📅 1. Daily Planner & Balanced Task Management
* **Holistic Task Categorization:** Organize daily tasks under three vital pillars: **Work**, **Family**, and **Self-Care**.
* **Intentional Living:** Set your daily intention, positive affirmations, and celebrate wins while capturing challenges and improvement areas.
* **Balance Scoring:** Rate your daily balance across Mind, Body, Work, and Self on intuitive sliders.

### ✍️ 2. Mindfulness & Gratitude Journal
* **Daily Reflections:** Journal daily gratitude, memorable highlights, and freeform thoughts.
* **Rotating Mindfulness Prompts:** Thoughtful prompts to encourage mindfulness and emotional awareness.
* **Emotional Check-in:** Log feelings and moods to track emotional trends over time.

### 🌿 3. Habit Tracking
* **Daily Rituals:** Track daily habits with one-click toggles (Hydration, 10k Steps, Deep Breathing, Skincare, Reading/Journaling, Healthy Nutrition).
* **Weekly & Monthly Consistency:** Visual habit grid to monitor streaks and completion percentages.

### 🧭 4. At-a-Glance Dashboard
* **Today's Overview:** Instant view of priority tasks, habit progress gauge, and daily mood.
* **AI Daily Quotes:** Fresh, inspiring quotes on balance and mindfulness fetched dynamically via Google Gemini.

### 📈 5. Growth & Reflection
* **Balance Radar Chart:** Multi-dimensional radar chart powered by Recharts visualizing your monthly balance across Mind, Body, Work, and Self.
* **Weekly Reviews:** Document weekly wins, challenges, and core lessons.
* **Monthly Milestones:** Set and review monthly intentions, goals, and growth summaries.

### 🤖 6. AI Wellness Coach
* Powered by **Google Gemini** (`gemini-2.5-flash`).
* Analyzes your recent 7-day mood trajectory and habit completion rates.
* Delivers gentle, personalized reflections and actionable, practical wellness advice.

### 🎨 7. Aesthetic Journal Experience & Customization
* **Digital Paper Aesthetic:** Tactile journal texture with Patrick Hand typography and subtle page-turn transitions.
* **Dynamic Ambient Backgrounds:** Cycle through 7 beautiful visual backdrops (Marble, Clouds, Ocean, Botanical, Sunset, White Desk, Frost, and Minimal).
* **Dark Mode Support:** Seamless toggle between light and dark paper modes.

### 💾 8. Local-First Authentication & Cloud Synchronization
* **Private Local Profiles:** Create and sign in with email/password accounts stored directly in browser storage with instant session auto-restore on refresh.
* **Instant Demo & Guest Mode:** 1-click Demo login (`demo@balance.app`) or "Explore as Guest" for immediate, password-free journal access.
* **Local-First Privacy:** All tasks, habits, and journals are saved locally with user account data isolation.
* **JSON Backup & Restore:** Export and restore full journal backups at any time.
* **Optional Cloud Sync:** Optional Google Sheets backend integration via Google OAuth (Google Identity Services) for multi-device sync when configured.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [Vite 6](https://vitejs.dev/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + Custom Paper & Glassmorphism themes |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Data Visualization** | [Recharts 3](https://recharts.org/) |
| **Date Handling** | [date-fns](https://date-fns.org/) |
| **AI Integration** | [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) (`gemini-2.5-flash`) |
| **Authentication & Cloud** | Google Identity Services (GIS) & Google Sheets API v4 |

---

## 📂 Project Structure

```text
├── components/
│   ├── BookCover.tsx         # Journal cover component
│   ├── DateNavigation.tsx    # Date picker and day navigation header
│   ├── Login.tsx             # Authentication modal (Google & Cloud Sync)
│   └── Sidebar.tsx           # Navigation bar, theme toggle, and JSON import/export
├── services/
│   ├── gemini.ts             # Google GenAI integration (daily quotes & AI wellness coach)
│   ├── sheets.ts             # Google Sheets API client for cloud database sync
│   └── storage.ts            # Local storage persistence and state migrations
├── views/
│   ├── Overview.tsx          # Daily summary, quick habits, priority tasks, and quote
│   ├── Planner.tsx           # Category-based daily planner (Work, Family, Self-Care)
│   ├── Habits.tsx            # Habit tracker and weekly streak matrix
│   ├── Wellness.tsx          # Gratitude journal, emotional check-ins, and prompts
│   ├── Growth.tsx            # Balance radar chart, weekly & monthly reflections
│   └── Insights.tsx          # AI Wellness Coach and mood trend charts
├── types.ts                  # Shared TypeScript interfaces and data models
├── App.tsx                   # Main application layout, state orchestrator, and themes
├── index.html                # HTML entry point with Google fonts & paper texture styles
├── index.tsx                 # React DOM root entry
├── vite.config.ts            # Vite configuration with env mapping and path aliases
└── metadata.json             # App configuration metadata
```

---

## 🚦 Getting Started

### Prerequisites

Ensure you have the following installed on your system:
* [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
* [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) / [pnpm](https://pnpm.io/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/find-your-balance.git
   cd find-your-balance
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *(You can obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/).)*

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:3000`.

5. **Build for production:**
   ```bash
   npm run build
   ```
   The production-ready assets will be generated in the `dist/` directory.

---

## 🔒 Data Privacy & Backup

* All tasks, habits, and journals are stored directly in your browser's local storage by default. No data leaves your device unless you choose to connect Google Sheets.
* **Exporting Data:** Click the **Export** button in the sidebar to download your complete journal as a `.json` backup file.
* **Importing Data:** Use the **Import** button to restore your journal data on another computer or browser.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
