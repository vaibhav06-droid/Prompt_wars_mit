# Campus Pulse 🎓⚡

> **Transforming messy campus notices into an intelligent, structured command center.**

Campus Pulse solves the everyday chaos of university life by ingesting unstructured, chaotic WhatsApp forwards, faculty emails, and circular notices, and converting them into clean, actionable task cards with dynamic urgency badges, interactive checklists, and AI-synthesized digests.

Built for **Prompt Wars 2026 (MIT)**.

---

## 🌟 Key Features

### 1. Ingestion Engine (WhatsApp & Webmail)
- **WhatsApp Ingestion Modal:** Simulates incoming unread batch, mess, and hostel group messages with 1-click loading (*Lab Exam Notices, Sunday Biryani Feasts, Hackathons, Sports Fixtures*).
- **College Webmail Ingestion Modal:** Simulated official `@mit.edu` circulars and placement emails with instant extraction.
- **Smart Raw Input Area:** Paste raw messages containing emojis, markdown asterisks, arrows, and messy dates.
- **Client-Side Regex & Heuristic Parser:** Extracts Title, Category, Date & Time, Venue, and Action Checklists with an extraction confidence score.
- **1-Click Judge Sample Buttons:** Instantly paste pre-formatted sample notices with zero typing.

### 2. Urgency Engine & Interactive Checklists
- **Dynamic Color Badges:**
  - 🟢 **Green ("On Track"):** Due in > 3 days.
  - 🟡 **Yellow ("Attention Needed"):** Due within 24 to 72 hours.
  - 🔴 **Red ("Urgent / Due Today"):** Due within 24 hours with an animated pulsing ping indicator.
  - 🔘 **Auto-Archived / Expired:** Automatically grayed out and shifted when deadlines pass without action.
- **Interactive Action Checklists:** Checkboxes with strike-through styling, confetti animations, and real-time completion tracking.

### 3. Student Performance & Activity Center
- **Overall Completion Rate Ring:** Visual circular progress ring with motivational status badges (*"Crushing It ⚡"*, *"Campus Legend 🔥"*).
- **Active Urgent Deadlines Counter (<24h)**.
- **Weekly Task Progress:** Pending vs. Completed breakdown.
- **Category Distribution Breakdown Pills** with real-time counters.
- **Persistent Notification Banner & Drawer:** Highlighting urgent unacknowledged items.

### 4. Views & "Weekly Digest" AI Summary
- **Three Flexible Views:**
  - **Card Grid View:** Rich cards with Unsplash category banners and countdowns.
  - **Compact List View:** High-density view for quick skimming.
  - **Calendar / Timeline Agenda View:** Visual chronological timeline grouped by day (*Today, Tomorrow, Next 2-5 Days, Later*).
- **"What do I need to know this week?" Modal:**
  - Synthesizes notices into:
    - 🚨 Critical Deadlines
    - 🍽️ Mess Updates & Special Dinners
    - 🏆 Upcoming Events & Workshops
    - ✅ High-Priority Action Items
  - **Copy Summary for WhatsApp:** Ready-to-broadcast formatted summary.
  - **AI Voice Read-Out:** Powered by the browser Web Speech API.

---

## 🛠️ Tech Stack

- **Framework:** React 18
- **Bundler:** Vite
- **Styling:** Tailwind CSS (Dark/Light mode support)
- **Icons:** Lucide React
- **Typography:** Plus Jakarta Sans & JetBrains Mono
- **State & Persistence:** Browser `localStorage` (persists across refreshes)
- **Lightweight:** Entire repo repository source code is **< 1 MB**!

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/vaibhav06-droid/Prompt_wars_mit.git
cd Prompt_wars_mit
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 📄 License
MIT License. Created for Prompt Wars 2026.

