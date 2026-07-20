# THE SYSTEM - Gamified Daily Quest Tracker

A complete, functional single-page web app inspired by Solo Leveling for tracking language learning, exercise, and content creation habits.

## 🚀 Features

- **Status Panel**: Displays Player Name, Level, Rank (`E-RANK` to `S-RANK`), and glowing XP progress bar.
- **Daily Quests**: Checklist of daily habit quests with category tags (`KÖRPER`, `SPRACHE`, `CONTENT`) and custom animated checkboxes.
- **Streak & Grace Tokens**: Maintains streak count with automatic daily resets and grace token safety nets.
- **Instant Dungeon**: Bonus challenge for extra XP and title rewards.
- **Quest Complete Modal**: Centered HUD glass popup with radiating ambient light rays.
- **Level Up Modal**: Full-screen takeover with vertical energy beams, level glow ring, unlocked title box, and rank transition badges.
- **Stats & Titles**:
  - **Weekly XP**: 7-day bar chart with cyan vertical gradients and sweep animation.
  - **Titles Grid**: 3x3 achievement badges with unlocked vs locked padlock silhouettes.
  - **Boss Fight**: Red hazard-striped countdown box (`D-45`) with editable exam target date.
- **Local Persistence**: Stores progress automatically in `localStorage` under `"the-system-data"`.

## 🛠️ Tech Stack

- React + TypeScript
- Tailwind CSS
- Vite
- Lucide Icons
- Canvas Confetti

## 🏃 Run Locally

```bash
npm install
npm run dev
```