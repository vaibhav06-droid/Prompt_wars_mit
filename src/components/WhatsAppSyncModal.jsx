import React, { useState } from 'react';
import { 
  X, 
  MessageSquare, 
  CheckCheck, 
  Sparkles, 
  DownloadCloud, 
  ArrowRight,
  ShieldCheck,
  Send
} from 'lucide-react';
import { WHATSAPP_SIMULATED_GROUPS } from '../utils/mockData';
import { parseCampusNotice } from '../utils/parser';
import { triggerConfetti } from '../utils/confetti';

export function WhatsAppSyncModal({ isOpen, onClose, onImportNotice }) {
  const [selectedGroup, setSelectedGroup] = useState(WHATSAPP_SIMULATED_GROUPS[0]);
  const [importedIds, setImportedIds] = useState(new Set());

  if (!isOpen) return null;

  const handleImport = (group) => {
    const parsed = parseCampusNotice(group.message, 'whatsapp');
    if (parsed) {
      onImportNotice(parsed);
      triggerConfetti();
      setImportedIds(prev => new Set([...prev, group.id]));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header with WhatsApp green branding */}
        <div className="px-6 py-4 bg-[#075E54] dark:bg-[#075E54]/90 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-2xl">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">WhatsApp Ingestion Engine</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-400 text-emerald-950">
                  Live Sync
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                Simulating unread messages forwarded in college batch & hostel groups
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Trigger Buttons Bar */}
        <div className="px-6 py-2.5 bg-[#128C7E]/10 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <span className="text-slate-500 dark:text-slate-400 shrink-0 font-bold">Quick Ingest:</span>
          {WHATSAPP_SIMULATED_GROUPS.map(grp => (
            <button
              key={grp.id}
              onClick={() => {
                setSelectedGroup(grp);
                handleImport(grp);
              }}
              className="px-3 py-1 rounded-xl bg-white dark:bg-slate-700 text-[#075E54] dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 hover:bg-emerald-50 dark:hover:bg-slate-600 transition-colors shrink-0 shadow-xs"
            >
              {grp.buttonLabel}
            </button>
          ))}
        </div>

        {/* Main Body: Chat list on left + active chat view on right */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[420px]">
          
          {/* Groups List */}
          <div className="md:col-span-5 border-r border-slate-200 dark:border-slate-800 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 bg-slate-50/50 dark:bg-slate-900/50">
            {WHATSAPP_SIMULATED_GROUPS.map(grp => {
              const isSelected = selectedGroup.id === grp.id;
              const isImported = importedIds.has(grp.id);

              return (
                <div
                  key={grp.id}
                  onClick={() => setSelectedGroup(grp)}
                  className={`p-3.5 sm:p-4 cursor-pointer transition-colors flex items-center gap-3 ${
                    isSelected 
                      ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-l-4 border-[#128C7E]' 
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#25D366]/20 flex items-center justify-center text-xl shrink-0">
                    {grp.avatar}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                        {grp.groupName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {grp.time}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-1 mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {grp.sender}: {grp.message.slice(0, 35)}...
                      </span>

                      {isImported ? (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 shrink-0 flex items-center gap-0.5">
                          <CheckCheck className="w-3.5 h-3.5" />
                          <span>Synced</span>
                        </span>
                      ) : (
                        <span className="w-5 h-5 rounded-full bg-[#25D366] text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                          {grp.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Chat Preview on Right */}
          <div className="md:col-span-7 flex flex-col justify-between bg-[#efeae2] dark:bg-slate-950/90 p-4 sm:p-6 overflow-y-auto">
            
            {/* Group Header */}
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedGroup.avatar}</span>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>{selectedGroup.groupName}</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Sender: {selectedGroup.sender}
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
                {selectedGroup.badge}
              </span>
            </div>

            {/* Chat Message Bubble */}
            <div className="flex-1 space-y-3">
              <div className="max-w-[92%] bg-white dark:bg-slate-800 rounded-2xl rounded-tl-sm p-4 shadow-sm border border-black/5 dark:border-white/5 space-y-2">
                <div className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                  <span>~ {selectedGroup.sender}</span>
                  <span className="text-slate-400 font-normal">{selectedGroup.time}</span>
                </div>

                <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                  {selectedGroup.message}
                </div>

                <div className="text-right text-[10px] text-slate-400 flex items-center justify-end gap-1">
                  <span>Delivered</span>
                  <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                </div>
              </div>
            </div>

            {/* Ingestion Action Footer */}
            <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {importedIds.has(selectedGroup.id)
                  ? 'Notice already synced to your dashboard'
                  : 'Ready to convert into structured tasks & deadlines'}
              </span>

              <button
                type="button"
                onClick={() => handleImport(selectedGroup)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all ${
                  importedIds.has(selectedGroup.id)
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-[#25D366] hover:bg-[#20ba59] text-white hover:scale-105 active:scale-95'
                }`}
              >
                {importedIds.has(selectedGroup.id) ? (
                  <>
                    <CheckCheck className="w-4 h-4" />
                    <span>Imported to Pulse</span>
                  </>
                ) : (
                  <>
                    <DownloadCloud className="w-4 h-4" />
                    <span>Extract & Add to Dashboard</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

