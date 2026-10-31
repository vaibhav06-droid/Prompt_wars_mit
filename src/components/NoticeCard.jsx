import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  CheckSquare, 
  Square, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  MessageSquare, 
  Mail, 
  FileText, 
  Pin, 
  Archive, 
  Trash2, 
  Edit3, 
  GraduationCap, 
  FileCheck, 
  UtensilsCrossed, 
  Rocket, 
  Building2,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { getUrgencyInfo, formatEventDateTime } from '../utils/urgency';
import { triggerConfetti } from '../utils/confetti';

const CATEGORY_ICONS = {
  'Exam': FileCheck,
  'Academic': GraduationCap,
  'Mess & Dining': UtensilsCrossed,
  'Campus Event / Hackathon': Rocket,
  'Administrative': Building2
};

export function NoticeCard({ 
  notice, 
  onToggleTask, 
  onAddTask, 
  onTogglePin, 
  onToggleArchive, 
  onDeleteNotice, 
  onEditNotice,
  onAcknowledge 
}) {
  const [showRaw, setShowRaw] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);

  const urgency = getUrgencyInfo(notice.date);
  const CategoryIcon = CATEGORY_ICONS[notice.category] || Rocket;

  const completedCount = notice.actionItems?.filter(t => t.completed).length || 0;
  const totalCount = notice.actionItems?.length || 0;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleTaskToggle = (taskId) => {
    onToggleTask(notice.id, taskId);
    // If completing the task, trigger celebration confetti
    const task = notice.actionItems.find(t => t.id === taskId);
    if (task && !task.completed) {
      triggerConfetti();
    }
  };

  const handleAddNewTask = (e) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    onAddTask(notice.id, newTaskText.trim());
    setNewTaskText('');
    setIsAddingTask(false);
  };

  // Source icon
  const getSourceBadge = () => {
    switch (notice.sourceType) {
      case 'whatsapp':
        return { label: 'WhatsApp Forward', icon: MessageSquare, color: 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-800' };
      case 'email':
        return { label: 'Faculty Mail', icon: Mail, color: 'text-indigo-700 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800' };
      case 'circular':
        return { label: 'Dean Circular', icon: FileText, color: 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800' };
      default:
        return { label: 'Campus Ingestion', icon: FileText, color: 'text-slate-700 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' };
    }
  };

  const source = getSourceBadge();
  const SourceIcon = source.icon;

  return (
    <div className={`group relative rounded-3xl bg-white dark:bg-slate-900 border transition-all duration-300 overflow-hidden flex flex-col justify-between ${
      urgency.isExpired || notice.isArchived
        ? 'opacity-70 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50'
        : notice.isPinned
        ? 'border-indigo-400 dark:border-indigo-600 shadow-md ring-2 ring-indigo-500/10'
        : urgency.status === 'red'
        ? 'border-rose-300 dark:border-rose-900/70 shadow-md hover:shadow-lg'
        : 'border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
    }`}>

      {/* Top Banner with Image and Category & Urgency Badges */}
      <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-900">
        <img
          src={notice.bannerImage}
          alt={notice.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out opacity-85"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

        {/* Top Floating Badges */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
          
          {/* Category Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-slate-800 dark:text-slate-100 shadow-sm">
            <CategoryIcon className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>{notice.category}</span>
          </div>

          {/* Quick Action Overlay (Pin, Edit, Archive, Delete) */}
          <div className="flex items-center gap-1 bg-slate-900/60 backdrop-blur-md p-1 rounded-2xl border border-white/10 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onTogglePin(notice.id)}
              className={`p-1.5 rounded-xl transition-colors ${
                notice.isPinned 
                  ? 'bg-indigo-600 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title={notice.isPinned ? 'Unpin Notice' : 'Pin to Top'}
            >
              <Pin className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEditNotice(notice)}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              title="Edit notice details"
            >
              <Edit3 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleArchive(notice.id)}
              className={`p-1.5 rounded-xl transition-colors ${
                notice.isArchived 
                  ? 'bg-amber-600 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title={notice.isArchived ? 'Restore notice' : 'Archive notice'}
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteNotice(notice.id)}
              className="p-1.5 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-rose-950/60 transition-colors"
              title="Delete notice"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Banner Details: Urgency Status + Source Tag */}
        <div className="absolute bottom-3 inset-x-3 flex items-center justify-between gap-2 z-10">
          
          {/* Dynamic Urgency Badge */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${urgency.badgeColor}`}>
            <span className={`w-2 h-2 rounded-full ${urgency.dotColor}`} />
            <span>{urgency.label}</span>
            <span className="opacity-80 font-mono text-[11px]">({urgency.relativeText})</span>
          </div>

          {/* Source indicator */}
          <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border backdrop-blur-md ${source.color}`}>
            <SourceIcon className="w-3 h-3" />
            <span className="hidden sm:inline">{source.label}</span>
          </div>
        </div>

      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Title */}
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
            {notice.title}
          </h3>

          {/* Metadata: Date, Time & Venue */}
          <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-500 shrink-0" />
              <span className="font-semibold">{formatEventDateTime(notice.date, notice.time)}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <span className="font-medium truncate">{notice.venue}</span>
            </div>
          </div>

          {/* Interactive Action Checklists Section */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Action Checklist ({completedCount}/{totalCount})</span>
              </span>

              {/* Mini progress bar */}
              <div className="w-16 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Checklist items */}
            <div className="space-y-1.5">
              {notice.actionItems?.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleTaskToggle(task.id)}
                  className={`group/task flex items-start gap-2.5 p-2 rounded-xl text-xs cursor-pointer select-none transition-colors ${
                    task.completed
                      ? 'bg-emerald-50/60 dark:bg-emerald-950/20 text-slate-400 dark:text-slate-500'
                      : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    className="mt-0.5 text-slate-400 group-hover/task:text-indigo-600 dark:text-slate-500 dark:group-hover/task:text-indigo-400 transition-colors shrink-0"
                  >
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                  <span className={`leading-relaxed break-words ${task.completed ? 'line-through decoration-emerald-500/50' : ''}`}>
                    {task.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Add task inline */}
            {isAddingTask ? (
              <form onSubmit={handleAddNewTask} className="mt-2 flex items-center gap-1.5">
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="e.g. Bring hardcopy printout"
                  className="flex-1 text-xs px-2.5 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-2.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingTask(false)}
                  className="px-2 py-1.5 text-xs text-slate-400 hover:text-slate-600"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingTask(true)}
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Plus className="w-3 h-3" />
                <span>Add Checklist Item</span>
              </button>
            )}

          </div>

          {/* Collapsible View Raw Chaotic WhatsApp / Mail Text */}
          {notice.rawSource && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowRaw(!showRaw)}
                className="w-full flex items-center justify-between text-[11px] font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              >
                <span>View Raw Incoming Text (Before Parsing)</span>
                {showRaw ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>

              {showRaw && (
                <div className="mt-2 p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 font-mono text-[11px] text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words leading-relaxed border border-slate-200 dark:border-slate-700 animate-fadeIn">
                  {notice.rawSource}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Card Footer Status */}
        {notice.autoResolved && (
          <div className="mt-3 pt-2 text-[11px] font-medium text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>Passed without user action (Auto-Archived)</span>
          </div>
        )}

      </div>
    </div>
  );
}

