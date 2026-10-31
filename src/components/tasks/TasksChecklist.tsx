'use client';

import React, { useState } from 'react';
import { useCampus } from '@/context/CampusContext';
import {
  CheckSquare,
  Square,
  Plus,
  Trash2,
  Clock,
  Calendar,
  AlertCircle,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Tag,
  ListTodo,
} from 'lucide-react';
import { calculateDeadlineInfo } from '@/lib/deadline';
import { CATEGORY_META, formatDateSafe } from '@/lib/utils';
import { detectTaskCompletion } from '@/lib/ai/extractor';

export function TasksChecklist() {
  const {
    items,
    toggleTask,
    undoLastTaskCompletion,
    lastCompletedTask,
    toggleSubTask,
    updateItem,
    addItem,
    deleteItem,
  } = useCampus();

  const [filterMode, setFilterMode] = useState<'all' | 'pending' | 'completed' | 'overdue'>('pending');
  const [quickInput, setQuickInput] = useState('');
  const [aiCompletionPrompt, setAiCompletionPrompt] = useState('');
  const [expandedSubtasksMap, setExpandedSubtasksMap] = useState<Record<string, boolean>>({});
  const [newSubtaskTitleMap, setNewSubtaskTitleMap] = useState<Record<string, string>>({});

  const tasksList = items.filter((item) => {
    if (!item.isTask) return false;

    const deadline = calculateDeadlineInfo(item);
    if (filterMode === 'pending') return item.status !== 'completed';
    if (filterMode === 'completed') return item.status === 'completed';
    if (filterMode === 'overdue') return item.status !== 'completed' && deadline.isOverdue;
    return true;
  });

  const handleQuickAdd = () => {
    if (!quickInput.trim()) return;
    addItem({
      title: quickInput.trim(),
      description: 'Quick task added via checklist',
      date: new Date().toISOString().split('T')[0],
      isTask: true,
      isEvent: false,
      category: 'personal_task',
      priority: 'medium',
      status: 'pending',
      source: 'manual',
    });
    setQuickInput('');
  };

  const handleAiCompletionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiCompletionPrompt.trim()) return;

    const check = detectTaskCompletion(aiCompletionPrompt, items);
    if (check.isCompletionMessage && check.matchedItem) {
      if (confirm(`AI detected task: "${check.matchedItem.title}". Mark as completed?`)) {
        toggleTask(check.matchedItem.id);
        setAiCompletionPrompt('');
      }
    } else {
      alert(`Could not identify matching pending task. Try typing e.g. "I have completed my physics assignment"`);
    }
  };

  const handleAddSubtask = (itemId: string) => {
    const title = newSubtaskTitleMap[itemId];
    if (!title || !title.trim()) return;

    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const existingSubtasks = item.subtasks || [];
    const newSub = {
      id: `sub-${Date.now()}`,
      title: title.trim(),
      completed: false,
    };

    updateItem(itemId, {
      subtasks: [...existingSubtasks, newSub],
    });

    setNewSubtaskTitleMap((prev) => ({ ...prev, [itemId]: '' }));
  };

  const toggleExpandSubtasks = (itemId: string) => {
    setExpandedSubtasksMap((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  return (
    <div className="space-y-5">
      {/* Undo Toast Notification */}
      {lastCompletedTask && (
        <div className="p-3.5 rounded-2xl bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xl flex items-center justify-between animate-in slide-in-from-top duration-200">
          <div className="flex items-center gap-2.5 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Marked &quot;{lastCompletedTask.item.title}&quot; as completed!</span>
          </div>
          <button
            onClick={undoLastTaskCompletion}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/20 dark:bg-black/10 hover:bg-white/30 text-xs font-bold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
        </div>
      )}

      {/* AI Completion Detection Input Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/70 to-purple-50/70 dark:from-indigo-950/40 dark:to-purple-950/40 border border-indigo-200 dark:border-indigo-800/60 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>AI-Assisted Completion Detection</span>
          </span>
          <span className="text-[11px] text-slate-500">Natural language task updates</span>
        </div>
        <form onSubmit={handleAiCompletionSubmit} className="flex gap-2">
          <input
            type="text"
            value={aiCompletionPrompt}
            onChange={(e) => setAiCompletionPrompt(e.target.value)}
            placeholder="Try: &quot;I have completed my physics assignment&quot; or &quot;submitted lab report&quot;"
            className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-campus-navy-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all shrink-0"
          >
            Detect & Mark
          </button>
        </form>
      </div>

      {/* Quick Add Bar & Filter Tabs */}
      <div className="p-4 rounded-2xl bg-white dark:bg-campus-navy-900 border border-slate-200/80 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Filter Pills */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-campus-navy-800 rounded-xl border border-slate-200 dark:border-slate-700/60">
          {(['pending', 'completed', 'overdue', 'all'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filterMode === mode
                  ? 'bg-white dark:bg-campus-navy-950 text-indigo-600 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Quick Task Add Input */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <input
            type="text"
            value={quickInput}
            onChange={(e) => setQuickInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
            placeholder="+ Add personal task or reminder..."
            className="w-full px-3.5 py-1.5 rounded-xl bg-slate-50 dark:bg-campus-navy-950 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none"
          />
          <button
            onClick={handleQuickAdd}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 shrink-0"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="space-y-3">
        {tasksList.map((task) => {
          const meta = CATEGORY_META[task.category];
          const deadline = calculateDeadlineInfo(task);
          const isCompleted = task.status === 'completed';
          const subtasks = task.subtasks || [];
          const completedSubtasksCount = subtasks.filter((s) => s.completed).length;
          const isExpanded = expandedSubtasksMap[task.id];

          return (
            <div
              key={task.id}
              className={`p-4 rounded-2xl bg-white dark:bg-campus-navy-900 border transition-all ${
                isCompleted
                  ? 'border-slate-200 dark:border-slate-800 opacity-70'
                  : deadline.color === 'RED'
                  ? 'border-rose-300 dark:border-rose-900/60'
                  : 'border-slate-200/80 dark:border-slate-800 hover:border-indigo-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleTask(task.id)}
                    className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <Square className="w-5 h-5 hover:text-indigo-500" />
                    )}
                  </button>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.badgeBg} ${meta.badgeText}`}>
                        {meta.label}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${deadline.badgeBg} ${deadline.badgeText} ${deadline.badgeBorder}`}>
                        {deadline.label} • {deadline.subLabel}
                      </span>
                    </div>

                    <h3
                      className={`text-sm font-bold text-slate-900 dark:text-white leading-snug ${
                        isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''
                      }`}
                    >
                      {task.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {task.description}
                    </p>

                    {/* Due Date & Action Required */}
                    <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-3">
                      <span>Target: {formatDateSafe(task.submissionDeadline || task.date)}</span>
                      {task.actionRequired && (
                        <span className="text-indigo-500 dark:text-indigo-400 font-medium">
                          Action: {task.actionRequired}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subtask Toggle & Delete */}
                <div className="flex items-center gap-2 shrink-0">
                  {subtasks.length > 0 && (
                    <button
                      onClick={() => toggleExpandSubtasks(task.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1.5"
                    >
                      <span>
                        {completedSubtasksCount}/{subtasks.length} subtasks
                      </span>
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  )}
                  <button
                    onClick={() => deleteItem(task.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Subtasks Accordion */}
              {isExpanded && (
                <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 pl-8">
                  {subtasks.map((st) => (
                    <div key={st.id} className="flex items-center gap-2.5">
                      <button
                        onClick={() => toggleSubTask(task.id, st.id)}
                        className="text-slate-400 hover:text-emerald-500"
                      >
                        {st.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                      <span
                        className={`text-xs ${
                          st.completed ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {st.title}
                      </span>
                    </div>
                  ))}

                  {/* Add Subtask Input */}
                  <div className="flex items-center gap-2 pt-1 max-w-sm">
                    <input
                      type="text"
                      value={newSubtaskTitleMap[task.id] || ''}
                      onChange={(e) =>
                        setNewSubtaskTitleMap((prev) => ({ ...prev, [task.id]: e.target.value }))
                      }
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSubtask(task.id)}
                      placeholder="+ Add subtask..."
                      className="w-full px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-campus-navy-950 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none"
                    />
                    <button
                      onClick={() => handleAddSubtask(task.id)}
                      className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold rounded-lg hover:bg-slate-200"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {tasksList.length === 0 && (
          <div className="p-8 text-center rounded-2xl bg-slate-50 dark:bg-campus-navy-900 border border-slate-200 dark:border-slate-800 text-slate-400 text-xs">
            No tasks found under &quot;{filterMode}&quot; filter.
          </div>
        )}
      </div>
    </div>
  );
}

