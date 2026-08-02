import React from 'react';
import { RefreshCw, Play, Pause, History, Settings, ShieldCheck, Zap, Bot, Layers, Lock, ShieldAlert, Cpu, Rss } from 'lucide-react';
import { AutoSyncState } from '../types';

interface HeaderProps {
  autoSyncState: AutoSyncState;
  onToggleAutoPosting: () => void;
  onOpenLogs: () => void;
  onOpenSettings: () => void;
  onOpenTelegramSettings: () => void;
  onManualSyncAll: () => void;
  onLockPlatform: () => void;
  isPlatformLocked: boolean;
  isSyncing: boolean;
  activeAccountsCount: number;
  activePage: 'x_sync' | 'telegram_hub' | 'ai_engine' | 'rss_feeds';
  onChangePage: (page: 'x_sync' | 'telegram_hub' | 'ai_engine' | 'rss_feeds') => void;
}

export const Header: React.FC<HeaderProps> = ({
  autoSyncState,
  onToggleAutoPosting,
  onOpenLogs,
  onOpenSettings,
  onOpenTelegramSettings,
  onManualSyncAll,
  onLockPlatform,
  isPlatformLocked,
  isSyncing,
  activeAccountsCount,
  activePage,
  onChangePage,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <header className="bg-[#0F1419] border-b border-[#2F3336] sticky top-0 z-30 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 space-y-3">
        
        {/* Top Row: Brand & Primary Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-black border border-[#333639] flex items-center justify-center text-white shadow-inner">
              {/* X Logo SVG */}
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg font-bold tracking-tight text-white">X Sync & Telegram Router</h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#1D9BF0]/15 text-[#1D9BF0] border border-[#1D9BF0]/30 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Auto-Broadcaster
                </span>
              </div>
              <p className="text-xs text-[#71767B]">
                Multi-Account Routing, Primary Sync & Telethon MTProto Bridge
              </p>
            </div>
          </div>

          {/* Global Controls & Status */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-3">
            {/* Connected accounts pill */}
            <div className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#16181C] border border-[#2F3336] text-xs text-[#E7E9EA]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span><strong className="text-white">{activeAccountsCount}</strong>/4 Accounts Active</span>
            </div>

            {/* Countdown Clock */}
            {autoSyncState.isAutoPosting && (
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#1D9BF0]/10 border border-[#1D9BF0]/30 text-xs font-mono text-[#1D9BF0] animate-pulse">
                <span>Next Sync:</span>
                <span className="font-bold text-sm text-white">{formatTime(autoSyncState.secondsRemaining)}</span>
              </div>
            )}

            {/* Auto-Posting Toggle Button */}
            <button
              onClick={onToggleAutoPosting}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                autoSyncState.isAutoPosting
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
              }`}
              title={autoSyncState.isAutoPosting ? 'Pause Auto Interval Sync' : 'Start Auto Interval Sync'}
            >
              {autoSyncState.isAutoPosting ? (
                <>
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Auto ({autoSyncState.intervalMinutes}m)</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Auto</span>
                </>
              )}
            </button>

            {/* Sync All Now Manual Button */}
            <button
              onClick={onManualSyncAll}
              disabled={isSyncing}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white transition-colors disabled:opacity-50 shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync All Now'}</span>
            </button>

            {/* Telegram Panel & Protection */}
            <button
              onClick={onOpenTelegramSettings}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#0088cc]/15 border border-[#0088cc]/40 text-[#0088cc] hover:bg-[#0088cc]/25 transition-colors text-xs font-semibold"
              title="Telegram Settings & Phone Login"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">Telegram Panel</span>
            </button>

            {/* Lock Platform Button */}
            <button
              onClick={onLockPlatform}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-colors text-xs font-semibold"
              title="Lock Platform Access with Password"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lock App</span>
            </button>

            {/* Audit Logs Modal Trigger */}
            <button
              onClick={onOpenLogs}
              className="p-2 rounded-lg bg-[#16181C] hover:bg-[#202327] border border-[#2F3336] text-[#E7E9EA] transition-colors"
              title="View Sync History Logs"
            >
              <History className="w-4 h-4" />
            </button>

            {/* Settings Trigger */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg bg-[#16181C] hover:bg-[#202327] border border-[#2F3336] text-[#E7E9EA] transition-colors"
              title="Advanced Settings, Proxy & Schedule"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Row: Primary Page Switcher Tabs */}
        <div className="flex items-center space-x-2 pt-1 border-t border-[#2F3336]/60 overflow-x-auto">
          <button
            onClick={() => onChangePage('x_sync')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activePage === 'x_sync'
                ? 'bg-[#1D9BF0] text-white shadow'
                : 'bg-[#16181C] text-[#71767B] hover:text-white border border-[#2F3336]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>X Sync Grid & Primary Account</span>
          </button>

          <button
            onClick={() => onChangePage('telegram_hub')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activePage === 'telegram_hub'
                ? 'bg-[#0088cc] text-white shadow'
                : 'bg-[#16181C] text-[#71767B] hover:text-white border border-[#2F3336]'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>Telegram Hub & Telethon Engine</span>
          </button>

          <button
            onClick={() => onChangePage('ai_engine')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activePage === 'ai_engine'
                ? 'bg-gradient-to-r from-[#1D9BF0] to-purple-600 text-white shadow'
                : 'bg-[#16181C] text-[#71767B] hover:text-white border border-[#2F3336]'
            }`}
          >
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>AI API Engine & MCP Settings</span>
          </button>

          <button
            onClick={() => onChangePage('rss_feeds')}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activePage === 'rss_feeds'
                ? 'bg-amber-500 text-black shadow font-extrabold'
                : 'bg-[#16181C] text-[#71767B] hover:text-white border border-[#2F3336]'
            }`}
          >
            <Rss className="w-4 h-4 text-amber-400" />
            <span>RSS Feeds & Telegram/X Auto-Route</span>
          </button>
        </div>

      </div>
    </header>
  );
};
