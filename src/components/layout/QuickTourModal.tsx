'use client';

import React, { useState } from 'react';
import { useCampus } from '@/context/CampusContext';
import {
  Compass,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Calendar,
  Flame,
  Bot,
  Mail,
  X,
  Play,
} from 'lucide-react';

export function QuickTourModal() {
  const {
    isTourOpen,
    setIsTourOpen,
    setIsSmartInputOpen,
    setIsWeeklySummaryOpen,
    setActiveTab,
  } = useCampus();

  const [currentStep, setCurrentStep] = useState(0);

  if (!isTourOpen) return null;

  const TOUR_STEPS = [
    {
      title: 'Welcome to CampusPulse AI',
      subtitle: 'Your Campus, Organised by AI',
      description:
        'CampusPulse AI is a complete, competition-ready platform that solves campus information overload by turning scattered messages, WhatsApp forwards, PDF notices, and emails into structured events, tasks, and deadlines.',
      badge: 'Step 1 of 6 • System Overview',
      actionLabel: 'Explore Smart Input',
      onAction: () => {
        setIsTourOpen(false);
        setIsSmartInputOpen(true);
      },
    },
    {
      title: '1. AI Smart Input (Flagship Feature)',
      subtitle: 'Multimodal Text, Hinglish, OCR & PDF Extraction',
      description:
        'Click the prominent "+ AI Smart Input" button on your dashboard. Paste unstructured text like "Guys kal 10 baje auditorium mein AI workshop hai. Sabko aana compulsory hai..." or upload posters/PDFs. AI detects relative dates, compulsory attendance, venues, benefits, and missing information.',
      badge: 'Step 2 of 6 • Multimodal Ingestion',
      actionLabel: 'Open AI Smart Input',
      onAction: () => {
        setIsTourOpen(false);
        setIsSmartInputOpen(true);
      },
    },
    {
      title: '2. Needs Attention Today',
      subtitle: 'Automated Real-time Urgent Prioritization',
      description:
        'The dashboard automatically highlights overdue assignments, tasks due today, and imminent registration closures in RED and YELLOW. Includes 1-click completion, snooze, and direct source inspection.',
      badge: 'Step 3 of 6 • Intelligent Triage',
      actionLabel: 'View Overview Dashboard',
      onAction: () => {
        setIsTourOpen(false);
        setActiveTab('overview');
      },
    },
    {
      title: '3. "What do I need to know this week?"',
      subtitle: 'Mandatory Competition Feature',
      description:
        'Click the prominent gradient button at the top right of your header. The AI instantly computes a structured weekly digest covering upcoming events, assignments due, mid-term examinations, and recommended priorities from actual stored data.',
      badge: 'Step 4 of 6 • Weekly AI Digest',
      actionLabel: 'Trigger Weekly AI Digest',
      onAction: () => {
        setIsTourOpen(false);
        setIsWeeklySummaryOpen(true);
      },
    },
    {
      title: '4. AI Conversational Campus Assistant',
      subtitle: 'Grounded Campus Q&A with Item References',
      description:
        'Switch to the AI Assistant tab and ask: "What should I do today?", "Which assignment has the nearest deadline?", or "What are my upcoming events?". AI provides precise answers with clickable links to relevant calendar cards.',
      badge: 'Step 5 of 6 • Conversational Agent',
      actionLabel: 'Open AI Assistant',
      onAction: () => {
        setIsTourOpen(false);
        setActiveTab('assistant');
      },
    },
    {
      title: '5. Campus Inbox & WhatsApp Import',
      subtitle: 'Gmail & WhatsApp Announcement Extractors',
      description:
        'View realistic faculty notices in the Campus Inbox. Click "Extract to CampusPulse" to convert any email into a verified calendar task. In the WhatsApp tab, paste exported chat logs to auto-detect announcements.',
      badge: 'Step 6 of 6 • Email & Chat Hub',
      actionLabel: 'Open Campus Inbox',
      onAction: () => {
        setIsTourOpen(false);
        setActiveTab('inbox');
      },
    },
  ];

  const step = TOUR_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-campus-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
              {step.badge}
            </span>
          </div>
          <button
            onClick={() => setIsTourOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-2">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            {step.title}
          </h3>
          <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
            {step.subtitle}
          </p>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
            {step.description}
          </p>
        </div>

        {/* Step dots */}
        <div className="flex items-center justify-center gap-1.5 pt-2">
          {TOUR_STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`h-2 rounded-full transition-all ${
                i === currentStep ? 'w-6 bg-indigo-600' : 'w-2 bg-slate-200 dark:bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            disabled={currentStep === 0}
            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={step.onAction}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold shadow-md transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>{step.actionLabel}</span>
            </button>

            {currentStep < TOUR_STEPS.length - 1 && (
              <button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                <span>Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

