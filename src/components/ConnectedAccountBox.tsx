import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Clock, 
  Repeat, 
  Heart, 
  Share, 
  MoreHorizontal, 
  Sparkles, 
  Edit3, 
  Send, 
  Zap, 
  AlertCircle, 
  ShieldCheck, 
  Maximize2, 
  Minimize2,
  Sliders,
  RotateCcw,
  Star,
  Crown,
  Video,
  Volume2,
  Film,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { XAccount, MasterPost } from '../types';

interface ConnectedAccountBoxProps {
  boxIndex: number; // 1, 2, 3, or 4
  account: XAccount;
  masterPost: MasterPost;
  onToggleRetracted: (id: string) => void;
  onToggleSyncEnabled: (id: string) => void;
  onUpdateOverrideText: (id: string, text: string) => void;
  onResetToMaster: (id: string) => void;
  onToggleAiAdaptation: (id: string) => void;
  onUpdateStaggerDelay: (id: string, minutes: number) => void;
  onPostIndividual: (id: string) => void;
  onSetPrimaryAccount: (id: string) => void;
  isSyncingThisAccount: boolean;
}

export const ConnectedAccountBox: React.FC<ConnectedAccountBoxProps> = ({
  boxIndex,
  account,
  masterPost,
  onToggleRetracted,
  onToggleSyncEnabled,
  onUpdateOverrideText,
  onResetToMaster,
  onToggleAiAdaptation,
  onUpdateStaggerDelay,
  onPostIndividual,
  onSetPrimaryAccount,
  isSyncingThisAccount,
}) => {
  const [isEditingOverride, setIsEditingOverride] = useState(false);

  // Effective text is custom override text if defined, else master post text
  const currentText = account.customOverrideText !== undefined 
    ? account.customOverrideText 
    : masterPost.text;

  const isCustomized = account.customOverrideText !== undefined && account.customOverrideText !== masterPost.text;

  return (
    <div 
      className={`bg-[#0F1419] border rounded-2xl transition-all duration-300 overflow-hidden ${
        account.isPrimary
          ? 'border-[#1D9BF0] shadow-[0_0_20px_rgba(29,155,240,0.15)] ring-1 ring-[#1D9BF0]/40'
          : account.isSyncEnabled 
          ? 'border-[#2F3336] hover:border-[#333639]' 
          : 'border-red-900/30 opacity-75'
      }`}
    >
      {/* Retractable Header Bar (Always Visible) */}
      <div 
        className={`px-4 md:px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none transition-colors ${
          account.isRetracted ? 'bg-[#16181C]' : 'bg-[#16181C] border-b border-[#2F3336]'
        }`}
        onClick={() => onToggleRetracted(account.id)}
      >
        {/* Left Side: Box Badge & Account Info */}
        <div className="flex items-center space-x-3 min-w-0">
          <span className="px-2 py-0.5 text-[10px] font-black tracking-wider uppercase rounded bg-black text-[#1D9BF0] border border-[#2F3336] shrink-0">
            Box {boxIndex}
          </span>

          <div className="relative shrink-0">
            <img 
              src={account.avatar} 
              alt={account.name} 
              className="w-10 h-10 rounded-full object-cover border border-[#2F3336]" 
            />
            {account.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 bg-[#1D9BF0] text-white p-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3 fill-current text-[#1D9BF0]" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center space-x-1.5">
              <h3 className="text-sm font-bold text-white truncate">{account.name}</h3>
              <span className="text-xs text-[#71767B] truncate">{account.handle}</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-[#71767B] mt-0.5">
              <span className="text-emerald-400 font-medium">{account.category}</span>
              <span>•</span>
              <span>{account.followers} Followers</span>
            </div>
          </div>
        </div>

        {/* Right Side: Primary Badge, Status Badges, Sync Toggle & Retract Button */}
        <div className="flex items-center space-x-2 shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Primary Account Badge or Set Primary Button */}
          {account.isPrimary ? (
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-[#1D9BF0]/20 text-[#1D9BF0] border border-[#1D9BF0]/50 flex items-center space-x-1 shadow-sm">
              <Star className="w-3.5 h-3.5 fill-current text-[#1D9BF0]" />
              <span>MAIN PRIMARY</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onSetPrimaryAccount(account.id)}
              className="px-2 py-0.5 rounded bg-black hover:bg-[#202327] border border-[#2F3336] text-[10px] font-semibold text-[#71767B] hover:text-[#1D9BF0] transition-colors flex items-center space-x-1"
              title="Set as Main Primary Account (Posting here will auto-sync to all secondary accounts & Telegram)"
            >
              <Crown className="w-3 h-3" />
              <span>Set as Main</span>
            </button>
          )}

          {/* Customized Badge */}
          {isCustomized && (
            <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Customized
            </span>
          )}

          {/* Sync Status Badge */}
          <span 
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border flex items-center space-x-1 ${
              isSyncingThisAccount
                ? 'bg-[#1D9BF0]/20 text-[#1D9BF0] border-[#1D9BF0]/40 animate-pulse'
                : account.syncStatus === 'synced'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : account.isSyncEnabled
                ? 'bg-blue-500/10 text-blue-300 border-blue-500/30'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${account.isSyncEnabled ? 'bg-emerald-400' : 'bg-zinc-500'}`}></span>
            <span className="uppercase text-[10px] font-bold">
              {isSyncingThisAccount ? 'Syncing...' : account.isSyncEnabled ? 'Sync Active' : 'Sync Off'}
            </span>
          </span>

          {/* Account Sync Switch */}
          <button
            type="button"
            onClick={() => onToggleSyncEnabled(account.id)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              account.isSyncEnabled ? 'bg-[#1D9BF0]' : 'bg-zinc-700'
            }`}
            title={account.isSyncEnabled ? 'Disable Sync for this account' : 'Enable Sync for this account'}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                account.isSyncEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>

          {/* Retract / Expand Chevron Toggle Button */}
          <button
            type="button"
            onClick={() => onToggleRetracted(account.id)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-black hover:bg-[#202327] border border-[#2F3336] text-xs font-semibold text-[#E7E9EA] transition-colors"
            title={account.isRetracted ? 'Expand box details' : 'Retract box to compact mode'}
          >
            <span className="text-[11px] hidden md:inline">
              {account.isRetracted ? 'Expand' : 'Retract'}
            </span>
            {account.isRetracted ? (
              <ChevronDown className="w-4 h-4 text-[#1D9BF0]" />
            ) : (
              <ChevronUp className="w-4 h-4 text-[#1D9BF0]" />
            )}
          </button>
        </div>
      </div>

      {/* Retracted Compact Summary Bar (Shown when retracted) */}
      {account.isRetracted && (
        <div className="px-4 py-2.5 bg-black/60 flex flex-wrap items-center justify-between text-xs text-[#71767B] gap-2 border-t border-[#2F3336]/40">
          <div className="flex items-center space-x-3 truncate">
            <span className="text-[#E7E9EA] font-medium truncate max-w-md">
              "{currentText.length > 80 ? currentText.substring(0, 80) + '...' : currentText || 'Empty post'}"
            </span>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            {account.staggerDelayMinutes > 0 && (
              <span className="text-amber-400 font-mono">
                Delay: +{account.staggerDelayMinutes}m
              </span>
            )}
            <span className="text-xs text-[#71767B]">
              Last synced: {account.lastSyncedAt || 'Never'}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onPostIndividual(account.id);
              }}
              disabled={isSyncingThisAccount || !currentText.trim()}
              className="px-2.5 py-1 bg-[#1D9BF0]/15 hover:bg-[#1D9BF0]/30 text-[#1D9BF0] border border-[#1D9BF0]/30 rounded-lg font-semibold text-[11px] transition-colors disabled:opacity-50"
            >
              Post Now
            </button>
          </div>
        </div>
      )}

      {/* Expanded Content Box (Shown when NOT retracted) */}
      {!account.isRetracted && (
        <div className="p-4 md:p-5 space-y-4 bg-[#0F1419]">
          {/* Account Settings & Controls Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#16181C] border border-[#2F3336]">
            {/* Delay & AI Adapt toggles */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs text-[#71767B]">Stagger Delay:</span>
                <select
                  value={account.staggerDelayMinutes}
                  onChange={(e) => onUpdateStaggerDelay(account.id, Number(e.target.value))}
                  className="bg-black text-white text-xs font-mono rounded border border-[#333639] px-2 py-0.5 focus:outline-none focus:border-[#1D9BF0]"
                >
                  <option value={0}>0m (Instant)</option>
                  <option value={2}>+2m Delay</option>
                  <option value={5}>+5m Delay</option>
                  <option value={10}>+10m Delay</option>
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => onToggleAiAdaptation(account.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center space-x-1 transition-colors ${
                    account.useAiAdaptation
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-black text-[#71767B] border-[#2F3336] hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>AI Persona Adapt</span>
                </button>
              </div>
            </div>

            {/* Override Reset / Edit Toggle */}
            <div className="flex items-center space-x-2">
              {isCustomized && (
                <button
                  type="button"
                  onClick={() => onResetToMaster(account.id)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium border border-zinc-700 flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset to Master</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsEditingOverride(!isEditingOverride)}
                className="px-2.5 py-1 rounded-lg bg-[#16181C] hover:bg-[#202327] border border-[#2F3336] text-xs font-semibold text-[#1D9BF0] flex items-center space-x-1"
              >
                <Edit3 className="w-3 h-3" />
                <span>{isEditingOverride ? 'Done Editing' : 'Customize Text'}</span>
              </button>
            </div>
          </div>

          {/* Custom Override Editor (If Editing) */}
          {isEditingOverride ? (
            <div className="space-y-2 p-3 rounded-xl bg-black border border-[#1D9BF0]/40">
              <div className="flex items-center justify-between text-xs text-[#71767B]">
                <span className="font-semibold text-white">Custom Override Text for {account.handle}</span>
                <span>{currentText.length}/280</span>
              </div>
              <textarea
                value={currentText}
                onChange={(e) => onUpdateOverrideText(account.id, e.target.value)}
                rows={3}
                className="w-full bg-[#16181C] text-white p-3 rounded-lg border border-[#2F3336] focus:outline-none focus:border-[#1D9BF0] text-sm"
              />
            </div>
          ) : (
            /* Live X Render Card Preview */
            <div className="p-4 rounded-xl bg-black border border-[#2F3336] space-y-3 relative">
              {/* Account Tweet Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <img src={account.avatar} alt={account.name} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <div className="flex items-center space-x-1">
                      <span className="text-sm font-bold text-white">{account.name}</span>
                      {account.verified && <CheckCircle2 className="w-3.5 h-3.5 fill-current text-[#1D9BF0]" />}
                    </div>
                    <span className="text-xs text-[#71767B]">{account.handle}</span>
                  </div>
                </div>
                <MoreHorizontal className="w-4 h-4 text-[#71767B]" />
              </div>

              {/* Tweet Message Text */}
              <p className="text-sm text-white whitespace-pre-wrap leading-relaxed">
                {currentText || <span className="italic text-[#71767B]">No message drafted yet...</span>}
              </p>

              {/* Media Attachments Preview if Master Post has media */}
              {masterPost.media.length > 0 && (
                <div className="space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 overflow-hidden rounded-xl border border-[#2F3336]">
                    {masterPost.media.map((med) => (
                      <div key={med.id} className="relative bg-black rounded-lg overflow-hidden border border-[#2F3336]">
                        {med.type === 'video' ? (
                          <div className="space-y-1">
                            <video src={med.url} controls className="w-full h-36 object-cover rounded bg-black" />
                            <div className="px-2 py-1 flex items-center justify-between text-[10px] text-red-400 font-bold bg-[#16181C]">
                              <span className="flex items-center gap-1">
                                <Video className="w-3 h-3" />
                                <span>{med.name || 'Video'}</span>
                              </span>
                              <span>Synced HD</span>
                            </div>
                          </div>
                        ) : med.type === 'audio' ? (
                          <div className="p-2.5 bg-[#16181C] space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400">
                              <span className="flex items-center gap-1">
                                <Volume2 className="w-3.5 h-3.5" />
                                <span>{med.name || 'Audio Clip'}</span>
                              </span>
                            </div>
                            <audio src={med.url} controls className="w-full h-7" />
                          </div>
                        ) : med.type === 'gif' ? (
                          <div className="relative">
                            <img src={med.url} alt="GIF" className="w-full h-36 object-cover" />
                            <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 text-[9px] font-black uppercase bg-amber-500 text-black rounded font-mono">
                              GIF
                            </span>
                          </div>
                        ) : med.type === 'document' ? (
                          <div className="p-2.5 bg-[#16181C] flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 font-bold text-blue-400">
                              <FileText className="w-4 h-4" />
                              <span className="truncate max-w-[120px]">{med.name}</span>
                            </span>
                            <a href={med.url} target="_blank" rel="noreferrer" className="text-[10px] text-[#1D9BF0] underline">Open</a>
                          </div>
                        ) : (
                          <img src={med.url} alt="Photo" className="w-full h-36 object-cover" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Poll preview if attached */}
              {masterPost.poll && (
                <div className="p-3 rounded-xl bg-[#16181C] border border-[#2F3336] space-y-2">
                  <p className="text-xs font-bold text-white">{masterPost.poll.question}</p>
                  <div className="space-y-1">
                    {masterPost.poll.options.map((opt, i) => (
                      <div key={i} className="p-2 rounded bg-black text-xs text-[#E7E9EA] border border-[#2F3336]">
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Footer Engagement Metrics */}
              <div className="flex items-center justify-between text-xs text-[#71767B] pt-2 border-t border-[#2F3336]/60">
                <div className="flex items-center space-x-1 hover:text-[#1D9BF0]">
                  <Share className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </div>
                <div className="flex items-center space-x-1 hover:text-emerald-400">
                  <Repeat className="w-3.5 h-3.5" />
                  <span>Retweet</span>
                </div>
                <div className="flex items-center space-x-1 hover:text-pink-500">
                  <Heart className="w-3.5 h-3.5" />
                  <span>Like</span>
                </div>
                <span className="text-[11px] font-mono text-[#71767B]">
                  Avg Imp: {account.stats.avgImpressions}
                </span>
              </div>
            </div>
          )}

          {/* Account Analytics & API Status Footer */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-[#71767B]">
            <div className="flex items-center space-x-3">
              <span>Posts Today: <strong className="text-white">{account.stats.postsToday}</strong></span>
              <span>•</span>
              <span>Total Synced: <strong className="text-white">{account.stats.totalSynced}</strong></span>
              <span>•</span>
              <span className="text-emerald-400 font-mono">X API Rate Limit: {account.apiConfig.rateLimitRemaining}/100</span>
            </div>

            <button
              onClick={() => onPostIndividual(account.id)}
              disabled={isSyncingThisAccount || !currentText.trim()}
              className="px-4 py-2 bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md transition-all disabled:opacity-40"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Post Directly to {account.handle}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
