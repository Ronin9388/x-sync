import React from 'react';
import { X, History, CheckCircle2, AlertTriangle, Trash2, ArrowUpRight } from 'lucide-react';
import { SyncLogEntry } from '../types';

interface SyncLogsModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: SyncLogEntry[];
  onClearLogs: () => void;
}

export const SyncLogsModal: React.FC<SyncLogsModalProps> = ({
  isOpen,
  onClose,
  logs,
  onClearLogs,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F1419] border border-[#2F3336] rounded-2xl max-w-2xl w-full p-6 text-white shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#2F3336]">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-[#1D9BF0]" />
            <h3 className="text-lg font-bold">X Account Sync History Logs</h3>
          </div>
          <div className="flex items-center space-x-2">
            {logs.length > 0 && (
              <button
                onClick={onClearLogs}
                className="p-1.5 rounded-lg text-xs text-red-400 hover:bg-red-500/10 flex items-center space-x-1"
                title="Clear all logs"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            )}
            <button onClick={onClose} className="p-1 rounded-lg text-[#71767B] hover:text-white hover:bg-[#16181C]">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Logs Table / List */}
        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
          {logs.length === 0 ? (
            <div className="py-12 text-center text-[#71767B] space-y-2">
              <History className="w-8 h-8 mx-auto opacity-40" />
              <p className="text-sm">No sync logs recorded yet.</p>
              <p className="text-xs">Broadcast a post or start auto-interval posting to view real-time audit logs.</p>
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-[#16181C] border border-[#2F3336] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{log.accountName}</span>
                    <span className="text-[#71767B]">{log.accountHandle}</span>
                    <span className="text-[10px] text-[#71767B] font-mono">• {log.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#E7E9EA] truncate max-w-lg">
                    "{log.textSent}"
                  </p>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-full border flex items-center space-x-1 ${
                      log.status === 'success'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-red-500/20 text-red-300 border-red-500/40'
                    }`}
                  >
                    {log.status === 'success' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>SYNCED</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3" />
                        <span>FAILED</span>
                      </>
                    )}
                  </span>
                  {log.tweetId && (
                    <span className="text-[10px] font-mono text-[#1D9BF0] bg-black px-1.5 py-0.5 rounded border border-[#333639]">
                      ID #{log.tweetId}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#2F3336] flex items-center justify-between text-xs text-[#71767B]">
          <span>Total Log Entries: <strong className="text-white">{logs.length}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#1D9BF0] text-white font-bold rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
