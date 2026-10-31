import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Wand2, 
  Trash2, 
  Calendar, 
  MapPin, 
  CheckCircle2, 
  Tag, 
  Zap, 
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { parseCampusNotice } from '../utils/parser';
import { SAMPLE_NOTICES } from '../utils/mockData';
import { triggerConfetti } from '../utils/confetti';

export function ParserInput({ onAddNotice }) {
  const [inputText, setInputText] = useState('');
  const [parsedPreview, setParsedPreview] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [copiedSampleName, setCopiedSampleName] = useState(null);

  // Run real-time heuristic extraction when text changes
  useEffect(() => {
    if (inputText.trim().length > 15) {
      const result = parseCampusNotice(inputText, 'manual');
      setParsedPreview(result);
    } else {
      setParsedPreview(null);
    }
  }, [inputText]);

  const handleLoadSample = (sample) => {
    setInputText(sample.text);
    setCopiedSampleName(sample.title);
    setTimeout(() => setCopiedSampleName(null), 2500);
  };

  const handleCommitNotice = (e) => {
    e?.preventDefault();
    if (!parsedPreview) {
      const fallback = parseCampusNotice(inputText || 'Campus Notice', 'manual');
      if (fallback) {
        onAddNotice(fallback);
        triggerConfetti();
        setInputText('');
        setParsedPreview(null);
      }
      return;
    }

    onAddNotice(parsedPreview);
    triggerConfetti();
    setInputText('');
    setParsedPreview(null);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors my-4">
      
      {/* Header bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Smart Raw Notice Ingestion</span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Live Heuristic Parser
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste forwarded WhatsApp messages, faculty emails, or circular text
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          
          {/* 1-Click Judge Sample Buttons */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>1-Click Demo Notices:</span>
            </span>

            {SAMPLE_NOTICES.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleLoadSample(sample)}
                className={`px-3 py-1.5 rounded-xl font-medium border text-xs transition-all flex items-center gap-1.5 ${
                  copiedSampleName === sample.title
                    ? 'bg-emerald-600 text-white border-emerald-600 scale-105'
                    : 'bg-slate-50 dark:bg-slate-800 hover:bg-indigo-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                <span>{sample.title}</span>
                <span className="text-[10px] opacity-75 font-mono">({sample.badge})</span>
              </button>
            ))}
          </div>

          {/* Raw Textarea */}
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste raw notice here (e.g. *URGENT: CS Lab Exam tomorrow at 4:30 PM in CS Lab 3. Bring signed lab record and ID card...*)"
              rows={4}
              className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40 p-4 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all resize-y font-sans leading-relaxed"
            />

            {inputText && (
              <button
                type="button"
                onClick={() => { setInputText(''); setParsedPreview(null); }}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                title="Clear input"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Live Extracted Preview Card */}
          {parsedPreview && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-slate-50 to-emerald-50/50 dark:from-slate-800/80 dark:via-slate-800/60 dark:to-emerald-950/20 border border-indigo-200/80 dark:border-indigo-900/60 space-y-3 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-900/80 dark:text-indigo-200">
                    <Tag className="w-3 h-3" />
                    <span>{parsedPreview.category}</span>
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    {parsedPreview.confidenceScore}% Extraction Confidence
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCommitNotice}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Extract & Add to Dashboard</span>
                </button>
              </div>

              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {parsedPreview.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span className="font-semibold">{parsedPreview.date} at {parsedPreview.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span className="font-semibold truncate">{parsedPreview.venue}</span>
                </div>
              </div>

              {parsedPreview.actionItems && parsedPreview.actionItems.length > 0 && (
                <div className="pt-2 border-t border-indigo-100 dark:border-slate-700">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
                    Extracted Action Checklist ({parsedPreview.actionItems.length} items):
                  </div>
                  <div className="space-y-1">
                    {parsedPreview.actionItems.map((task, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-200">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{task.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}

