import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  DownloadCloud, 
  CheckCheck, 
  Paperclip, 
  Calendar, 
  Building, 
  ShieldCheck,
  Star
} from 'lucide-react';
import { COLLEGE_MAIL_SIMULATED } from '../utils/mockData';
import { parseCampusNotice } from '../utils/parser';
import { triggerConfetti } from '../utils/confetti';

export function CollegeMailSyncModal({ isOpen, onClose, onImportNotice }) {
  const [selectedMail, setSelectedMail] = useState(COLLEGE_MAIL_SIMULATED[0]);
  const [importedMailIds, setImportedMailIds] = useState(new Set());

  if (!isOpen) return null;

  const handleImport = (mail) => {
    const parsed = parseCampusNotice(mail.body, 'email');
    if (parsed) {
      onImportNotice(parsed);
      triggerConfetti();
      setImportedMailIds(prev => new Set([...prev, mail.id]));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-2xl">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">College Webmail Ingestion</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-400 text-indigo-950">
                  @mit.edu
                </span>
              </div>
              <p className="text-xs text-indigo-100">
                Official circulars, faculty announcements & placement notices
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

        {/* Mail View Grid */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-[420px]">
          
          {/* Inbox List on Left */}
          <div className="md:col-span-5 border-r border-slate-200 dark:border-slate-800 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            {COLLEGE_MAIL_SIMULATED.map(mail => {
              const isSelected = selectedMail.id === mail.id;
              const isImported = importedMailIds.has(mail.id);

              return (
                <div
                  key={mail.id}
                  onClick={() => setSelectedMail(mail)}
                  className={`p-4 cursor-pointer transition-colors space-y-1 ${
                    isSelected
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-l-4 border-indigo-600'
                      : 'hover:bg-slate-100/70 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                      {mail.from.split('<')[0]}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {mail.date.split('•')[0]}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {mail.subject}
                  </h4>

                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {mail.preview}
                  </p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {mail.tag}
                    </span>

                    {isImported ? (
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5">
                        <CheckCheck className="w-3.5 h-3.5" />
                        <span>Extracted</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">
                        Ready to extract
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mail Content on Right */}
          <div className="md:col-span-7 flex flex-col justify-between bg-white dark:bg-slate-900 p-5 sm:p-6 overflow-y-auto">
            
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                    {selectedMail.subject}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                    <span className="font-medium text-slate-700 dark:text-slate-300">{selectedMail.from}</span>
                    <span>•</span>
                    <span>{selectedMail.date}</span>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 shrink-0">
                  {selectedMail.tag}
                </span>
              </div>

              {/* Full circular body */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                {selectedMail.body}
              </div>
            </div>

            {/* Action Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Parsing will extract deadlines, checklist items & venue details.
              </span>

              <button
                type="button"
                onClick={() => handleImport(selectedMail)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all ${
                  importedMailIds.has(selectedMail.id)
                    ? 'bg-emerald-600 text-white cursor-default'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:scale-105 active:scale-95'
                }`}
              >
                {importedMailIds.has(selectedMail.id) ? (
                  <>
                    <CheckCheck className="w-4 h-4" />
                    <span>Extracted to Pulse</span>
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

