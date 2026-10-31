'use client';

import React, { useState } from 'react';
import { useCampus } from '@/context/CampusContext';
import {
  User,
  Sliders,
  Key,
  Shield,
  RotateCcw,
  CheckCircle2,
  Save,
  Moon,
  Sun,
  Laptop,
  AlertTriangle,
  Download,
} from 'lucide-react';

export function SettingsView() {
  const { profile, updateProfile, resetToDemo, items } = useCampus();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [rollNumber, setRollNumber] = useState(profile.rollNumber);
  const [branch, setBranch] = useState(profile.branch);
  const [semester, setSemester] = useState(profile.semester);
  const [collegeName, setCollegeName] = useState(profile.collegeName);

  // Settings
  const [yellowDays, setYellowDays] = useState(profile.settings.yellowWarningDays);
  const [redHours, setRedHours] = useState(profile.settings.redWarningHours);
  const [apiKey, setApiKey] = useState(profile.settings.geminiApiKey || '');
  const [theme, setTheme] = useState(profile.settings.theme);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    updateProfile({
      name,
      email,
      rollNumber,
      branch,
      semester,
      collegeName,
      settings: {
        ...profile.settings,
        yellowWarningDays: Number(yellowDays),
        redWarningHours: Number(redHours),
        geminiApiKey: apiKey.trim(),
        theme,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(items, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `campuspulse_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="p-4 px-6 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Workspace Settings & Profile
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize student profile, AI credentials, and deadline warning thresholds
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
        >
          {savedSuccess ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              <span>Saved Successfully</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Student Profile Card */}
      <div className="p-6 rounded-3xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-indigo-500" />
          <span>Student Academic Profile</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-campus-navy-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Roll / Registration Number
            </label>
            <input
              type="text"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-campus-navy-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              College / University
            </label>
            <input
              type="text"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-campus-navy-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Department / Branch
            </label>
            <input
              type="text"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-campus-navy-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Deadline Warning Thresholds */}
      <div className="p-6 rounded-3xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-500" />
          <span>Configurable Deadline Warning Thresholds</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Control when campus events and assignments shift from GREEN (Safe) to YELLOW (Approaching) and RED (Imminent).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 space-y-2">
            <label className="text-xs font-bold text-amber-800 dark:text-amber-300">
              YELLOW Warning Threshold (Days)
            </label>
            <input
              type="number"
              min={1}
              max={14}
              value={yellowDays}
              onChange={(e) => setYellowDays(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-campus-navy-950 border border-amber-300 dark:border-amber-800 text-xs text-slate-900 dark:text-white outline-none"
            />
            <p className="text-[11px] text-amber-700 dark:text-amber-400">
              Items due within {yellowDays} days show as &quot;Approaching&quot;
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/60 space-y-2">
            <label className="text-xs font-bold text-rose-800 dark:text-rose-300">
              RED Warning Threshold (Hours)
            </label>
            <input
              type="number"
              min={1}
              max={72}
              value={redHours}
              onChange={(e) => setRedHours(Number(e.target.value))}
              className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-campus-navy-950 border border-rose-300 dark:border-rose-800 text-xs text-slate-900 dark:text-white outline-none"
            />
            <p className="text-[11px] text-rose-700 dark:text-rose-400">
              Items due within {redHours} hours show as &quot;Imminent / Urgent&quot;
            </p>
          </div>
        </div>
      </div>

      {/* AI API Configuration */}
      <div className="p-6 rounded-3xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Key className="w-4 h-4 text-purple-500" />
          <span>Google Gemini API Configuration</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Optional: Provide a personal Google Gemini API key to enable live cloud LLM extraction. If left blank, the application automatically uses the built-in smart offline demo engine.
        </p>

        <div className="space-y-1">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-campus-navy-950 border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-purple-500"
          />
          <span className="text-[10px] text-slate-400">
            Stored locally in browser session storage • Never transmitted to third parties
          </span>
        </div>
      </div>

      {/* Data Management & Competition Reset */}
      <div className="p-6 rounded-3xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          <span>Data Backup & Competition Demo Reset</span>
        </h3>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Saved Data (.json)</span>
          </button>

          <button
            onClick={() => {
              if (confirm('Reset all items, emails, and notifications to original competition demo dataset?')) {
                resetToDemo();
                alert('Workspace reset to default competition state.');
              }
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Demo Dataset</span>
          </button>
        </div>
      </div>
    </div>
  );
}

