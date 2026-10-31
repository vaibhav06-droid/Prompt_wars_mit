'use client';

import React, { useState, useRef } from 'react';
import { useCampus } from '@/context/CampusContext';
import {
  Sparkles,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  PenTool,
  Upload,
  AlertTriangle,
  CheckCircle,
  Copy,
  X,
  ArrowRight,
  Info,
  Calendar,
  Clock,
  MapPin,
  Tag,
  ShieldAlert,
} from 'lucide-react';
import { DEMO_SAMPLES } from '@/data/demoSamples';
import { parseUnstructuredInput, detectTaskCompletion } from '@/lib/ai/extractor';
import { AIAnalysisResult, ExtractedAIItem, SourceType, CategoryType, PriorityLevel } from '@/types';
import { CATEGORY_META, PRIORITY_META } from '@/lib/utils';
import confetti from 'canvas-confetti';

export function SmartInputModal() {
  const {
    isSmartInputOpen,
    setIsSmartInputOpen,
    items,
    addItem,
    updateItem,
    profile,
    toggleTask,
  } = useCampus();

  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'pdf' | 'chat' | 'manual'>('text');
  const [inputText, setInputText] = useState('');
  const [sourceType, setSourceType] = useState<SourceType>('whatsapp');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);
  const [completionAlert, setCompletionAlert] = useState<{ matchedItemTitle: string; itemId: string } | null>(null);

  // Editable review items
  const [reviewItems, setReviewItems] = useState<ExtractedAIItem[]>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isSmartInputOpen) return null;

  const handleApplySample = (sampleText: string, type: SourceType = 'whatsapp') => {
    setInputText(sampleText);
    setSourceType(type);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
        // Realistic poster OCR extraction
        setInputText(
          `BYTECODE CODING HACKATHON 2026\nVenue: Central Computing Centre, Block C\nDate: November 8, 2026 | Time: 09:00 AM - 09:00 PM\nPrize Pool: ₹75,000 + Internship Shortlisting!\nRegistration Deadline: November 4, 2026.\nRules: Teams of 3-4. Bring laptops, extension cords.\nFree Pizza, Red Bull & Swag for all participants!`
        );
        setSourceType('poster');
      };
      reader.readAsDataURL(file);
    } else if (file.name.endsWith('.pdf')) {
      // PDF Notice simulated extraction
      setInputText(
        `OFFICE OF DEAN ACADEMICS - CIRCULAR REF: NIT/ACAD/2026/1104\nSubject: Mid-Semester Examination Schedule\nCompiler Design (CS302) examination will be held on November 5, 2026 at 09:30 AM in Examination Halls A & B.\nReporting time is 09:00 AM. Original hall ticket is mandatory.\nController of Examinations`
      );
      setSourceType('pdf');
    } else if (file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = reader.result as string;
        setInputText(text);
        setSourceType('whatsapp');
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;

    setIsAnalyzing(true);
    setCompletionAlert(null);

    // 1. Check for AI task completion intent (Requirement #6)
    const completionCheck = detectTaskCompletion(inputText, items);
    if (completionCheck.isCompletionMessage && completionCheck.matchedItem) {
      setIsAnalyzing(false);
      setCompletionAlert({
        matchedItemTitle: completionCheck.matchedItem.title,
        itemId: completionCheck.matchedItem.id,
      });
      return;
    }

    try {
      // 2. Perform intelligent extraction (supports Gemini API or instant deterministic fallback)
      const result = await parseUnstructuredInput(
        inputText,
        sourceType,
        items,
        profile.settings.geminiApiKey
      );
      setAnalysisResult(result);
      setReviewItems(result.items);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUpdateReviewField = (index: number, field: keyof ExtractedAIItem, value: any) => {
    setReviewItems((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveAll = () => {
    reviewItems.forEach((rev) => {
      addItem({
        title: rev.title,
        description: rev.description,
        date: rev.date,
        time: rev.time,
        venue: rev.venue,
        category: rev.category,
        priority: rev.priority,
        status: 'pending',
        source: sourceType,
        sourceRawText: inputText,
        sourceSnippet: rev.sourceSnippet || inputText.slice(0, 100),
        isEvent: rev.isEvent,
        isTask: rev.isTask,
        attendance: rev.attendance,
        registrationDeadline: rev.registrationDeadline,
        submissionDeadline: rev.submissionDeadline,
        instructions: rev.instructions,
        benefits: rev.benefits,
        actionRequired: rev.actionRequired,
      });
    });

    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch {
      // safe fallback
    }

    // Reset and close
    setAnalysisResult(null);
    setReviewItems([]);
    setInputText('');
    setPreviewImage(null);
    setUploadedFileName(null);
    setIsSmartInputOpen(false);
  };

  const handleConfirmTaskCompletion = () => {
    if (completionAlert) {
      toggleTask(completionAlert.itemId);
      setCompletionAlert(null);
      setIsSmartInputOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-campus-navy-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 sm:px-8 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 via-purple-50/20 to-transparent dark:from-indigo-950/20 dark:via-purple-950/10 dark:to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25 text-white">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">AI Smart Input</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  {profile.settings.geminiApiKey ? 'Gemini 1.5 Active' : 'AI Offline Parser Active'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Paste any unstructured text, Hinglish notice, WhatsApp forward, poster, or PDF.
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setIsSmartInputOpen(false);
              setAnalysisResult(null);
              setInputText('');
              setCompletionAlert(null);
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Completion Confirmation Alert */}
        {completionAlert && (
          <div className="m-6 p-5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
                  AI Completion Detection
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  AI identified that you completed: <strong className="text-indigo-600 dark:text-indigo-400">&quot;{completionAlert.matchedItemTitle}&quot;</strong>.
                  Would you like to mark this task as completed now?
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={handleConfirmTaskCompletion}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-all"
                  >
                    Yes, Mark Completed
                  </button>
                  <button
                    onClick={() => setCompletionAlert(null)}
                    className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Body */}
        {!analysisResult ? (
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            {/* Input Format Selector Tabs */}
            <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100 dark:bg-campus-navy-800 rounded-2xl border border-slate-200 dark:border-slate-700/60 max-w-fit">
              <button
                onClick={() => { setActiveTab('text'); setSourceType('whatsapp'); }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'text'
                    ? 'bg-white dark:bg-campus-navy-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Text & Hinglish</span>
              </button>

              <button
                onClick={() => { setActiveTab('image'); setSourceType('poster'); }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'image'
                    ? 'bg-white dark:bg-campus-navy-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Poster & Screenshots (OCR)</span>
              </button>

              <button
                onClick={() => { setActiveTab('pdf'); setSourceType('pdf'); }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'pdf'
                    ? 'bg-white dark:bg-campus-navy-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF Notice</span>
              </button>

              <button
                onClick={() => { setActiveTab('chat'); setSourceType('whatsapp'); }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'chat'
                    ? 'bg-white dark:bg-campus-navy-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Copy className="w-3.5 h-3.5" />
                <span>WhatsApp .txt</span>
              </button>
            </div>

            {/* Quick Demo Pre-fill Chips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Competition Demo Presets (1-Click Fill)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {DEMO_SAMPLES.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleApplySample(sample.content, sample.type === 'pdf' ? 'pdf' : sample.type === 'image' ? 'poster' : 'whatsapp')}
                    className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-indigo-50 dark:bg-campus-navy-800 dark:hover:bg-indigo-950/50 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all flex items-center gap-1.5 text-left"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span>{sample.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload Zone (for image, PDF, or .txt) */}
            {(activeTab === 'image' || activeTab === 'pdf' || activeTab === 'chat') && (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-200 dark:border-indigo-900/60 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-6 text-center cursor-pointer bg-indigo-50/20 dark:bg-indigo-950/10 transition-colors group"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={activeTab === 'image' ? 'image/*' : activeTab === 'pdf' ? '.pdf' : '.txt'}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Upload className="w-8 h-8 mx-auto text-indigo-500 group-hover:scale-110 transition-transform mb-2" />
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {uploadedFileName ? `Loaded: ${uploadedFileName}` : `Click to upload ${activeTab.toUpperCase()}`}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  AI will automatically perform OCR extraction and structure all dates & instructions.
                </p>
                {previewImage && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={previewImage}
                      alt="Uploaded poster preview"
                      className="max-h-48 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Input Text Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Input text or extracted OCR content:</span>
                <span>{inputText.length} characters</span>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Example: Guys kal 10 baje auditorium mein AI workshop hai. Sabko aana compulsory hai. Registration ki last date 5 November hai. Bring your laptop. Certificate bhi milega."
                rows={5}
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-campus-navy-950/80 border border-slate-200 dark:border-slate-800 text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-sans leading-relaxed"
              />
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Relative dates (&quot;kal&quot;, &quot;parso&quot;) are resolved automatically.
              </span>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !inputText.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 text-white font-semibold text-sm shadow-xl shadow-indigo-500/25 transition-all transform active:scale-98"
              >
                {isAnalyzing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Extracting with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Analyse with AI</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Review & Edit Structured Extracted Card(s) */
          <div className="p-6 sm:p-8 space-y-6 overflow-y-auto">
            {/* Header info */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">
                    {analysisResult.overallSummary}
                  </span>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 uppercase">
                    Language: {analysisResult.detectedLanguage}
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Review and customize any field below before saving to your official schedule and calendar.
                </p>
              </div>
              <button
                onClick={() => setAnalysisResult(null)}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
              >
                ← Edit raw text
              </button>
            </div>

            {/* Possible Duplicate Warnings */}
            {analysisResult.possibleDuplicates && analysisResult.possibleDuplicates.length > 0 && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 space-y-2">
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400 font-semibold text-xs">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Potential Duplicate Detected</span>
                </div>
                {analysisResult.possibleDuplicates.map((dup, i) => (
                  <p key={i} className="text-xs text-amber-800 dark:text-amber-300">
                    Extracted item #{dup.extractedIndex + 1} appears similar to existing entry: &quot;<strong>{dup.existingItemTitle}</strong>&quot;.
                    ({dup.similarityReason})
                  </p>
                ))}
              </div>
            )}

            {/* Extracted Item Cards for Review */}
            <div className="space-y-6">
              {reviewItems.map((item, index) => {
                const meta = CATEGORY_META[item.category];
                return (
                  <div
                    key={index}
                    className="p-5 rounded-2xl bg-white dark:bg-campus-navy-950/80 border border-slate-200 dark:border-slate-800 shadow-md space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${meta.badgeBg} ${meta.badgeText}`}>
                          {meta.label}
                        </span>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${PRIORITY_META[item.priority].badgeBg} ${PRIORITY_META[item.priority].badgeText}`}>
                          {PRIORITY_META[item.priority].label}
                        </span>
                        {item.attendance && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            Attendance: {item.attendance.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" />
                        {item.confidence}% Confidence
                      </span>
                    </div>

                    {/* Unspecified field notice */}
                    {item.unspecifiedFields && item.unspecifiedFields.length > 0 && (
                      <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>
                          Notice: <strong>{item.unspecifiedFields.join(', ')}</strong> not explicitly mentioned in source text. Default values applied.
                        </span>
                      </div>
                    )}

                    {/* Editable Fields Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2 space-y-1">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                          Title
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleUpdateReviewField(index, 'title', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-campus-navy-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Event / Target Date (Resolved)</span>
                        </label>
                        <input
                          type="date"
                          value={item.date}
                          onChange={(e) => handleUpdateReviewField(index, 'date', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-campus-navy-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Time</span>
                        </label>
                        <input
                          type="text"
                          value={item.time || ''}
                          onChange={(e) => handleUpdateReviewField(index, 'time', e.target.value)}
                          placeholder="e.g. 10:00 AM"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-campus-navy-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Venue</span>
                        </label>
                        <input
                          type="text"
                          value={item.venue || ''}
                          onChange={(e) => handleUpdateReviewField(index, 'venue', e.target.value)}
                          placeholder="e.g. College Auditorium"
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-campus-navy-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                          <Tag className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Category</span>
                        </label>
                        <select
                          value={item.category}
                          onChange={(e) => handleUpdateReviewField(index, 'category', e.target.value as CategoryType)}
                          className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-campus-navy-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="workshop">Workshop</option>
                          <option value="college_event">College Event</option>
                          <option value="seminar">Seminar</option>
                          <option value="assignment">Assignment</option>
                          <option value="examination">Examination</option>
                          <option value="registration_deadline">Registration Deadline</option>
                          <option value="cultural_festival">Cultural Festival</option>
                          <option value="sports_event">Sports Event</option>
                          <option value="announcement">Announcement</option>
                          <option value="personal_task">Personal Task</option>
                        </select>
                      </div>

                      {item.registrationDeadline && (
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-rose-500 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Registration Last Date</span>
                          </label>
                          <input
                            type="date"
                            value={item.registrationDeadline}
                            onChange={(e) => handleUpdateReviewField(index, 'registrationDeadline', e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-campus-navy-900 border border-rose-300 dark:border-rose-900 text-sm text-slate-900 dark:text-white outline-none"
                          />
                        </div>
                      )}

                      {/* Instructions & Benefits */}
                      {(item.instructions || item.benefits) && (
                        <div className="sm:col-span-2 pt-2 space-y-2 border-t border-slate-100 dark:border-slate-800">
                          {item.instructions && (
                            <div className="text-xs text-slate-600 dark:text-slate-300">
                              <span className="font-semibold text-indigo-500">Instructions: </span>
                              {item.instructions.join(' • ')}
                            </div>
                          )}
                          {item.benefits && (
                            <div className="text-xs text-emerald-600 dark:text-emerald-400">
                              <span className="font-semibold">Benefits / Perks: </span>
                              {item.benefits.join(' • ')}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Finalize Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setAnalysisResult(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAll}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-xl shadow-emerald-500/20 transition-all transform active:scale-98"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Save to Schedule & Calendar ({reviewItems.length})</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

