# CampusPulse AI – Your Campus, Organised by AI.

[![Competition Ready](https://img.shields.io/badge/Status-Competition%20Ready-success?style=for-the-badge)](https://github.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)

> **College AI Application Development Competition Entry**  
> **Tagline:** *Your Campus, Organised by AI.*  
> **Target Audience:** College & University Students navigating chaotic WhatsApp groups, emails, notices, and deadlines.

---

## 🌟 Executive Summary

College students receive critical academic and extracurricular notices across scattered channels: informal WhatsApp group chats, messy forwards in Hinglish, faculty emails, PDF circulars, and event flyers. Important deadlines are missed, venue details are forgotten, and study schedules derail.

**CampusPulse AI** transforms this chaotic stream into structured, actionable, and intelligently prioritized schedules. Whether the student pastes a forwarded Hinglish WhatsApp message, uploads a hackathon poster, or imports a batch of college emails, CampusPulse AI extracts key dates, times, venues, compulsory requirements, and deadlines in seconds.

---

## 🏆 Key Features Implemented

### 1. ⚡ AI Smart Input (The Flagship Feature)
- **Multimodal Ingestion**: Accepts unstructured text, WhatsApp forwards, exported `.txt` chat logs, event poster screenshots, and PDF circulars.
- **Hinglish & Informal Language Support**: Accurately resolves messy Indian college slang and mixed phrases (*"Guys kal 10 baje auditorium mein AI workshop hai. Sabko aana compulsory hai. Registration ki last date 5 November hai. Bring your laptop. Certificate bhi milega."*).
- **Intelligent Attribute Extraction**:
  - Event title & category (Workshops, Assignments, Exams, Cultural Fest, Sports, etc.)
  - Relative dates resolved to exact calendar dates (e.g., *"kal"* $\rightarrow$ tomorrow, *"parso"* $\rightarrow$ day after tomorrow, *"5 November"* $\rightarrow$ exact ISO date)
  - Time resolution (*"10 baje"* $\rightarrow$ `10:00 AM`, *"raat 11:59"* $\rightarrow$ `11:59 PM`)
  - Venues (*"Auditorium Block B"*, *"Room 302"*, *"LMS Portal"*)
  - Attendance requirements (`Compulsory` vs `Optional`)
  - Registration & submission deadlines
  - Required actions, equipment (*"Bring laptop with Python"*), and perks (*"Certificate", "Cash Prizes"*)
- **Multi-Event Splitting**: Automatically detects and splits multiple events/deadlines mentioned within a single forwarded message.
- **Unspecified Information Safety**: Flags ambiguous or missing fields without hallucinating false details.
- **Card Review & Editing**: Interactive modal to review, modify, or enhance structured cards before saving.
- **Dual AI Engine**: Seamlessly uses Google Gemini 1.5 Flash when an API key is provided, with an offline-capable deterministic parser fallback.

### 2. 🔥 "NEEDS ATTENTION TODAY" Section
- Dedicated hero section on the main dashboard.
- Prioritizes overdue assignments (RED), tasks due today, events taking place today, and imminent registration closures.
- Quick actions: **Mark Completed**, **Snooze (+24h)**, **View Details**, and **Open Original Source**.

### 3. ✨ Mandatory Feature: "What do I need to know this week?"
- Prominent gradient trigger button located in the header.
- Generates a concise, highly readable weekly executive briefing computed strictly from the student's actual database:
  - Upcoming events & workshops
  - Pending assignments with due dates
  - Mid-term examination timetables
  - Registration deadlines closing this week
  - Recommended priority action plan
- Includes an instant **Refresh** button to regenerate the briefing as tasks are completed.

### 4. 🎨 Smart Colour-Coded Deadline Management
- **GREEN**: Safe ($> 3$ days remaining).
- **YELLOW**: Approaching ($\le 3$ days remaining).
- **RED**: Imminent ($< 24$ hours remaining) or Overdue.
- **GREY**: Completed or Archived.
- Dynamic progress bars, relative human countdowns (*"Due in 4 hours"*, *"Overdue by 2 days"*), and user-configurable warning thresholds.

### 5. ✅ Intelligent Task Checklist
- Interactive checklist for assignments, lab reports, and personal tasks.
- **AI-Assisted Completion Detection**: Natural language detection (e.g., student inputs *"I have completed my physics assignment"* $\rightarrow$ AI suggests marking the task as done).
- Subtasks with progress bars and inline addition.
- **Undo Toast Notification** with celebratory confetti animation on completion.
- Never auto-marks tasks as complete just because a deadline passed (flags as overdue instead).

### 6. 📅 Interactive Calendar (My Schedule)
- **Month Grid** and **Agenda List** views.
- Color-coded chips indicating category and deadline urgency.
- Clickable chips open full event detail modals with source tracking.

### 7. 🤖 Conversational Campus Assistant
- Grounded chatbot answering student questions exclusively using stored records:
  - *"What should I do today?"*
  - *"Which assignment has the nearest deadline?"*
  - *"What are my upcoming college events?"*
  - *"What do I need to complete this week?"*
- Interactive clickable references directly linked to events and tasks.

### 8. 📬 Campus Inbox (Gmail & WhatsApp Hub)
- **Gmail Integration Tab**: Simulated college inbox loaded with realistic professor, placement cell, and dean emails. 1-click **"Extract to CampusPulse"** button turns emails into calendar tasks.
- **WhatsApp Import Tab**: Upload or paste exported `.txt` transcripts with regex timestamp parsing and announcement filters.

### 9. 📊 Personal Performance Analytics
- Calculated **Productivity Score** ($0 - 100\%$) based on on-time submission rate, completed tasks, and overdue penalties.
- Recharts visualizations:
  1. Weekly Task Completion Velocity (Area Chart)
  2. Completed vs Pending vs Overdue (Donut Chart)
  3. Monthly Productivity Index Progression (Line Chart)
  4. Category Distribution Breakdown
- Personalized weekly AI performance report.

### 10. 🔍 Global Search (`Ctrl+K`)
- Instant keyboard shortcut and search bar filtering across titles, descriptions, categories, venues, and source snippets.

### 11. 🔔 Intelligent Notification Centre
- In-app notification center with snooze, acknowledge, and dismiss actions.
- Web Browser Push Notification API integration with test triggers.

### 12. 🏆 Competition Demonstration Mode
- Preloaded with **12+ realistic campus entries** (AI Workshop, Distributed Systems Lab 3, Google/Microsoft Placement Talk, Compiler Design Exam, Smart India Hackathon, Library book returns).
- **Interactive Tour**: 6-step guided walkthrough for competition judges.
- **1-Click Reset**: Instant reset back to the pristine demo dataset at any time.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router, Server Actions, API Routes) |
| **Language** | TypeScript (Strict mode enabled) |
| **Styling** | Tailwind CSS (Linear / Notion inspired deep navy dark palette) |
| **Icons** | Lucide React |
| **Visualizations** | Recharts (ResponsiveContainer, AreaChart, PieChart, LineChart, BarChart) |
| **Micro-Interactions** | Canvas Confetti, CSS Animations |
| **Date Utility** | `date-fns` v3 |
| **AI Integration** | Google Gemini 1.5 Flash API + Smart Local Deterministic Fallback Engine |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (tested on Node.js v26.13.0)
- npm 9+

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 🎯 Guided Competition Demo Workflow

Judges can test the full capabilities of the application in under 2 minutes:

1. **Step 1: AI Smart Input**
   - Click the **"+ AI Smart Input"** button in the sidebar or header.
   - Click the preset chip: **"Official Prompt (Hinglish AI Workshop)"**.
   - Notice the input text: *"Guys kal 10 baje auditorium mein AI workshop hai. Sabko aana compulsory hai. Registration ki last date 5 November hai. Bring your laptop. Certificate bhi milega."*
   - Click **"Analyse with AI"**.
   - Observe the extracted title, resolved date (`2026-11-01`), time (`10:00 AM`), venue (`College Main Auditorium`), category (`Workshop`), compulsory attendance, and registration deadline (`2026-11-05`).
   - Click **"Save to Schedule & Calendar"** (triggers celebration confetti).

2. **Step 2: Needs Attention Today**
   - View the prominent **NEEDS ATTENTION TODAY** section on the Overview page.
   - Click **"Complete"** on the Distributed Systems Lab 3 assignment. Notice the real-time undo toast and badge updates.

3. **Step 3: Mandatory Weekly Digest**
   - Click the **"What do I need to know this week?"** button in the top header.
   - Inspect the generated digest summarizing all active campus deadlines and recommended priorities.

4. **Step 4: AI Conversational Assistant**
   - Navigate to the **AI Campus Assistant** tab.
   - Click the prompt suggestion: *"Which assignment has the nearest deadline?"*.
   - See the grounded response with clickable link cards.

5. **Step 5: Campus Inbox Extraction**
   - Open the **Campus Inbox** tab.
   - Select the placement talk email from Google & Microsoft.
   - Click **"Extract to CampusPulse"** to instantly convert it into an event.

---

## 📄 License
Created for College AI Application Development Competition 2026.
All rights reserved.

