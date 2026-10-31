import React, { useState, useEffect } from 'react';
import { X, Save, Plus, Trash2, Calendar, MapPin, Tag } from 'lucide-react';

const CATEGORIES = [
  'Exam',
  'Academic',
  'Mess & Dining',
  'Campus Event / Hackathon',
  'Administrative'
];

export function EditNoticeModal({ isOpen, onClose, notice, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Academic',
    date: '',
    time: '',
    venue: '',
    actionItems: []
  });
  const [newTaskInput, setNewTaskInput] = useState('');

  useEffect(() => {
    if (notice) {
      setFormData({
        title: notice.title || '',
        category: notice.category || 'Academic',
        date: notice.date || '',
        time: notice.time || '',
        venue: notice.venue || '',
        actionItems: notice.actionItems ? [...notice.actionItems] : []
      });
    }
  }, [notice]);

  if (!isOpen || !notice) return null;

  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      actionItems: [
        ...prev.actionItems,
        { id: 'task_' + Date.now(), text: newTaskInput.trim(), completed: false }
      ]
    }));
    setNewTaskInput('');
  };

  const handleRemoveTask = (taskId) => {
    setFormData(prev => ({
      ...prev,
      actionItems: prev.actionItems.filter(t => t.id !== taskId)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...notice,
      ...formData
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Edit Notice Details
          </h3>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Venue
              </label>
              <input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Time
              </label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g. 04:30 PM"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Action Tasks */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-2">
              Action Items Checklist
            </label>
            <div className="space-y-1.5 mb-2">
              {formData.actionItems.map((task) => (
                <div key={task.id} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                  <span className="truncate">{task.text}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTask(task.id)}
                    className="text-slate-400 hover:text-rose-500 shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <input
                type="text"
                value={newTaskInput}
                onChange={(e) => setNewTaskInput(e.target.value)}
                placeholder="Add another action item..."
                className="flex-1 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddTask}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 shrink-0"
              >
                Add
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

