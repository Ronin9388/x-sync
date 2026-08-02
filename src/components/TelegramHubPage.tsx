import React, { useState, useRef } from 'react';
import { 
  Send, 
  Plus, 
  Bot, 
  Radio, 
  Layers, 
  CheckCircle2, 
  Zap, 
  RefreshCw, 
  ArrowRightLeft, 
  ArrowRight, 
  MessageSquare, 
  Settings, 
  Trash2,
  Phone,
  UserCheck,
  Star,
  Globe,
  Video,
  Volume2,
  Film,
  Image as ImageIcon,
  FileText,
  X,
  Upload
} from 'lucide-react';
import { 
  TelegramChannel, 
  TelegramMessage, 
  BridgeRule, 
  TelegramCredentials,
  XAccount,
  MasterPost
} from '../types';

interface TelegramHubPageProps {
  credentials: TelegramCredentials;
  channels: TelegramChannel[];
  messages: TelegramMessage[];
  bridgeRules: BridgeRule[];
  xAccounts: XAccount[];
  masterPost: MasterPost;
  onOpenSettings: () => void;
  onAddChannel: (channel: Omit<TelegramChannel, 'id'>) => void;
  onToggleChannelActive: (id: string) => void;
  onSetPrimaryChannel: (id: string) => void;
  onDeleteChannel: (id: string) => void;
  onAddBridgeRule: (rule: Omit<BridgeRule, 'id'>) => void;
  onToggleRuleActive: (id: string) => void;
  onDeleteBridgeRule: (id: string) => void;
  onSendTelegramMessage: (
    channelId: string, 
    text: string, 
    mediaUrl?: string, 
    mediaType?: 'image' | 'video' | 'gif' | 'audio' | 'document', 
    mediaName?: string
  ) => void;
  onImportToXMaster: (text: string) => void;
  onInstantBroadcastToX: (text: string) => void;
  addToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const TelegramHubPage: React.FC<TelegramHubPageProps> = ({
  credentials,
  channels,
  messages,
  bridgeRules,
  xAccounts,
  masterPost,
  onOpenSettings,
  onAddChannel,
  onToggleChannelActive,
  onSetPrimaryChannel,
  onDeleteChannel,
  onAddBridgeRule,
  onToggleRuleActive,
  onDeleteBridgeRule,
  onSendTelegramMessage,
  onImportToXMaster,
  onInstantBroadcastToX,
  addToast,
}) => {
  const [activeTab, setActiveTab] = useState<'messenger' | 'channels' | 'bridge'>('messenger');
  const [selectedChannelId, setSelectedChannelId] = useState<string>(channels[0]?.id || '');
  const [chatInputText, setChatInputText] = useState<string>('');
  const [isAddingChannel, setIsAddingChannel] = useState<boolean>(false);
  const [isAddingRule, setIsAddingRule] = useState<boolean>(false);

  // New Channel Form State
  const [newChannelTitle, setNewChannelTitle] = useState('');
  const [newChannelUsername, setNewChannelUsername] = useState('');
  const [newChannelType, setNewChannelType] = useState<'source_feed' | 'managed_destination' | 'bot'>('source_feed');
  const [newAutoForwardToX, setNewAutoForwardToX] = useState(true);

  // New Bridge Rule State
  const [newRuleTitle, setNewRuleTitle] = useState('');
  const [newRuleDirection, setNewRuleDirection] = useState<'x_to_telegram' | 'telegram_to_x' | 'bidirectional'>('bidirectional');
  const [newRuleAiAdapt, setNewRuleAiAdapt] = useState(true);
  const [newRuleKeywords, setNewRuleKeywords] = useState('');

  const selectedChannel = channels.find((c) => c.id === selectedChannelId) || channels[0];
  const activeChannelMessages = messages.filter((m) => m.channelId === selectedChannelId);

  const primaryXAccount = xAccounts.find((a) => a.isPrimary) || xAccounts[0];
  const primaryTelegramChannel = channels.find((c) => c.isPrimary) || channels[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;
    if (!selectedChannel) {
      addToast('error', 'Select a Channel', 'Please select or add a Telegram channel first.');
      return;
    }

    onSendTelegramMessage(selectedChannel.id, chatInputText.trim());
    setChatInputText('');
    addToast('success', 'Message Sent to Telegram!', `Broadcasted to ${selectedChannel.title} (${selectedChannel.username}).`);
  };

  const handleCreateChannelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelTitle.trim() || !newChannelUsername.trim()) return;

    onAddChannel({
      title: newChannelTitle.trim(),
      username: newChannelUsername.startsWith('@') ? newChannelUsername.trim() : `@${newChannelUsername.trim()}`,
      type: newChannelType,
      subscribers: `${Math.floor(2 + Math.random() * 45)}.${Math.floor(1 + Math.random() * 9)}K`,
      isActive: true,
      isPrimary: channels.length === 0,
      autoForwardToX: newAutoForwardToX,
      autoReceiveFromX: true,
      aiSummarizeBeforeSync: true,
    });

    setNewChannelTitle('');
    setNewChannelUsername('');
    setIsAddingChannel(false);
    addToast('success', 'Telegram Channel Added', `Connected ${newChannelTitle} to Telethon engine.`);
  };

  const handleCreateRuleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleTitle.trim()) return;

    onAddBridgeRule({
      title: newRuleTitle.trim(),
      direction: newRuleDirection,
      sourceId: 'x_primary',
      targetId: selectedChannel?.id || 'all',
      isActive: true,
      aiAdaptation: newRuleAiAdapt,
      autoApprove: true,
      filterKeywords: newRuleKeywords,
    });

    setNewRuleTitle('');
    setNewRuleKeywords('');
    setIsAddingRule(false);
    addToast('success', 'Bridge Rule Created', 'Auto-sync pathway activated between X and Telegram.');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Telethon Engine & Primary Bi-Directional Sync Banner */}
      <div className="bg-[#0F1419] border border-[#2F3336] rounded-2xl p-4 md:p-5 shadow-xl space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-[#0088cc]/15 border border-[#0088cc]/30 flex items-center justify-center text-[#0088cc]">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-black"></span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white">Telethon MTProto Bridge Engine</h2>
                {credentials.isAuthenticatedWithPhone ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
                    <UserCheck className="w-3 h-3" />
                    <span>Phone Session Active</span>
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Bot Mode (Sign in with Phone for Telethon)
                  </span>
                )}
              </div>
              <p className="text-xs text-[#71767B] mt-0.5">
                Listening across <strong className="text-white">{channels.filter((c) => c.isActive).length}</strong> channels • 
                Phone: <strong className="text-white">{credentials.phoneNumber || 'Not set'}</strong>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenSettings}
              className="px-3.5 py-2 rounded-xl bg-[#16181C] hover:bg-[#202327] border border-[#2F3336] text-xs font-semibold text-white flex items-center space-x-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-[#0088cc]" />
              <span>Phone Sign-In & Settings</span>
            </button>

            <button
              onClick={() => setIsAddingChannel(true)}
              className="px-3.5 py-2 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold text-xs flex items-center space-x-1.5 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add Channel / Bot</span>
            </button>
          </div>
        </div>

        {/* Bi-Directional Sync Primary Routing Banner */}
        <div className="p-3.5 bg-gradient-to-r from-[#1D9BF0]/15 via-purple-500/10 to-[#0088cc]/15 border border-[#1D9BF0]/30 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2 font-bold text-white">
            <Zap className="w-4 h-4 text-[#1D9BF0]" />
            <span>Bi-Directional Primary Auto-Bridge:</span>
          </div>

          <div className="flex items-center space-x-3 text-xs font-mono">
            <div className="flex items-center space-x-1.5 bg-black/60 px-2.5 py-1 rounded-lg border border-[#1D9BF0]/40 text-[#1D9BF0]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>X Primary: {primaryXAccount?.handle || '@Main'}</span>
            </div>

            <ArrowRightLeft className="w-4 h-4 text-purple-400 shrink-0 animate-pulse" />

            <div className="flex items-center space-x-1.5 bg-black/60 px-2.5 py-1 rounded-lg border border-[#0088cc]/40 text-[#0088cc]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>Telegram Primary: {primaryTelegramChannel?.title || 'None'} ({primaryTelegramChannel?.username || '@Main'})</span>
            </div>
          </div>

          <p className="text-[11px] text-[#71767B]">
            Posts made in Primary X route to Primary Telegram, and incoming Primary Telegram posts auto-sync to X!
          </p>
        </div>

      </div>

      {/* Telegram Hub Navigation Bar */}
      <div className="flex items-center space-x-2 border-b border-[#2F3336] pb-3">
        <button
          onClick={() => setActiveTab('messenger')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors ${
            activeTab === 'messenger'
              ? 'bg-[#0088cc] text-white shadow'
              : 'bg-[#16181C] text-[#71767B] hover:text-white border border-[#2F3336]'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Telegram Messenger & Live Feed</span>
          {messages.length > 0 && (
            <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-black/40 text-white rounded-full font-mono">
              {messages.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('channels')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors ${
            activeTab === 'channels'
              ? 'bg-[#0088cc] text-white shadow'
              : 'bg-[#16181C] text-[#71767B] hover:text-white border border-[#2F3336]'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Followed Channels & Managed Bots ({channels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('bridge')}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-colors ${
            activeTab === 'bridge'
              ? 'bg-[#0088cc] text-white shadow'
              : 'bg-[#16181C] text-[#71767B] hover:text-white border border-[#2F3336]'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>X ↔ Telegram Bridge Rules ({bridgeRules.length})</span>
        </button>
      </div>

      {/* TAB 1: TELEGRAM MESSENGER & LIVE AGGREGATOR */}
      {activeTab === 'messenger' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-[#0F1419] border border-[#2F3336] rounded-2xl overflow-hidden min-h-[520px]">
          
          {/* Left Column: Channels & Bots Selection List */}
          <div className="border-r border-[#2F3336] bg-[#16181C]/50 flex flex-col">
            <div className="p-3.5 border-b border-[#2F3336] flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Connected Channels & Bots
              </span>
              <button
                onClick={() => setIsAddingChannel(true)}
                className="text-xs text-[#0088cc] hover:underline flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>

            <div className="divide-y divide-[#2F3336]/60 overflow-y-auto flex-1 max-h-[500px]">
              {channels.map((ch) => {
                const isSelected = ch.id === selectedChannelId;
                return (
                  <div
                    key={ch.id}
                    onClick={() => setSelectedChannelId(ch.id)}
                    className={`p-3.5 cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected ? 'bg-[#0088cc]/15 border-l-4 border-[#0088cc]' : 'hover:bg-[#202327]/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-black border border-[#2F3336] flex items-center justify-center text-[#0088cc] shrink-0 font-bold text-xs relative">
                        {ch.title.substring(0, 2).toUpperCase()}
                        {ch.isPrimary && (
                          <span className="absolute -top-1 -right-1 p-0.5 bg-amber-400 text-black rounded-full" title="Primary Telegram Channel">
                            <Star className="w-2.5 h-2.5 fill-current" />
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-1">
                          <h4 className="text-xs font-bold text-white truncate">{ch.title}</h4>
                          {ch.isPrimary && (
                            <span className="px-1.5 py-0.2 text-[9px] font-bold bg-amber-400/20 text-amber-300 rounded border border-amber-400/30">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-[#71767B] truncate">{ch.username}</p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase ${
                      ch.type === 'source_feed'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                        : ch.type === 'managed_destination'
                        ? 'bg-blue-500/10 text-blue-300 border border-blue-500/30'
                        : 'bg-purple-500/10 text-purple-300 border border-purple-500/30'
                    }`}>
                      {ch.type === 'source_feed' ? 'Source' : ch.type === 'managed_destination' ? 'Target' : 'Bot'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Telegram Chat Room & Aggregator Actions */}
          <div className="lg:col-span-2 flex flex-col justify-between p-4 md:p-5 space-y-4">
            
            {/* Selected Channel Header */}
            {selectedChannel ? (
              <div className="flex items-center justify-between border-b border-[#2F3336] pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-[#0088cc]/20 border border-[#0088cc]/40 flex items-center justify-center text-[#0088cc] font-bold relative">
                    {selectedChannel.title.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                      <span>{selectedChannel.title}</span>
                      <span className="text-xs font-normal text-[#71767B]">({selectedChannel.username})</span>
                      {selectedChannel.isPrimary && (
                        <span className="px-2 py-0.5 text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 rounded-full font-bold">
                          Primary Telegram Section
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-emerald-400 flex items-center space-x-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Telethon Channel Active • {selectedChannel.subscribers} Subscribers</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {!selectedChannel.isPrimary && (
                    <button
                      type="button"
                      onClick={() => onSetPrimaryChannel(selectedChannel.id)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 transition-colors flex items-center space-x-1"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Set as Main Telegram</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onToggleChannelActive(selectedChannel.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                      selectedChannel.isActive
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    {selectedChannel.isActive ? 'Monitoring Enabled' : 'Paused'}
                  </button>
                </div>
              </div>
            ) : null}

            {/* Live Telegram Message Stream */}
            <div className="flex-1 space-y-3 overflow-y-auto max-h-[360px] pr-2">
              {activeChannelMessages.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#71767B] space-y-2">
                  <MessageSquare className="w-8 h-8 mx-auto text-zinc-700" />
                  <p>No messages received yet in this Telegram channel.</p>
                  <p className="text-[11px] text-[#0088cc]">Type a message below to broadcast or test auto-forwarding!</p>
                </div>
              ) : (
                activeChannelMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3.5 rounded-2xl border space-y-2 max-w-xl ${
                      msg.isIncoming
                        ? 'bg-[#16181C] border-[#2F3336] text-white ml-0'
                        : 'bg-[#0088cc]/15 border-[#0088cc]/30 text-white ml-auto'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-[#71767B]">
                      <span className="font-bold text-[#0088cc]">{msg.senderName}</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    <p className="text-xs leading-relaxed whitespace-pre-wrap text-[#E7E9EA]">{msg.text}</p>

                    {/* Media Attachment Rendering */}
                    {msg.mediaUrl && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-[#2F3336] bg-black">
                        {msg.mediaType === 'video' ? (
                          <div>
                            <video src={msg.mediaUrl} controls className="w-full max-h-56 object-cover bg-black" />
                            <div className="p-2 text-[10px] font-bold text-red-400 bg-[#16181C] flex items-center justify-between">
                              <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" /> <span>{msg.mediaName || 'Telegram HD Video'}</span></span>
                              <span>MP4</span>
                            </div>
                          </div>
                        ) : msg.mediaType === 'audio' ? (
                          <div className="p-2.5 bg-[#16181C] space-y-1">
                            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1"><Volume2 className="w-3.5 h-3.5" /> <span>{msg.mediaName || 'Voice Note'}</span></span>
                            <audio src={msg.mediaUrl} controls className="w-full h-8" />
                          </div>
                        ) : msg.mediaType === 'gif' ? (
                          <div className="relative">
                            <img src={msg.mediaUrl} alt="GIF" className="w-full max-h-56 object-cover" />
                            <span className="absolute bottom-2 left-2 px-1.5 py-0.5 text-[9px] font-black uppercase bg-amber-500 text-black rounded font-mono">ANIMATED GIF</span>
                          </div>
                        ) : msg.mediaType === 'document' ? (
                          <div className="p-3 bg-[#16181C] flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 font-bold text-blue-400"><FileText className="w-4 h-4" /> <span>{msg.mediaName || 'Document'}</span></span>
                            <a href={msg.mediaUrl} target="_blank" rel="noreferrer" className="text-xs text-[#0088cc] underline font-bold">Download</a>
                          </div>
                        ) : (
                          <img src={msg.mediaUrl} alt="Photo" className="w-full max-h-56 object-cover" />
                        )}
                      </div>
                    )}

                    {/* Aggregator Actions on Telegram Message */}
                    <div className="pt-2 border-t border-[#2F3336]/60 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      <div className="flex items-center space-x-2">
                        {msg.syncedToX && (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold text-[10px]">
                            Synced to X
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2">
                        {/* Import to X Master Box */}
                        <button
                          onClick={() => onImportToXMaster(msg.text)}
                          className="px-2.5 py-1 bg-black hover:bg-[#202327] text-[#1D9BF0] border border-[#1D9BF0]/30 rounded-lg font-semibold transition-colors"
                        >
                          Send to X Master Composer
                        </button>

                        {/* Instant Cross Post to X Accounts */}
                        <button
                          onClick={() => onInstantBroadcastToX(msg.text)}
                          className="px-2.5 py-1 bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white rounded-lg font-bold transition-colors"
                        >
                          Broadcast to X Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Telegram Chat Input Composer */}
            <form onSubmit={handleSendMessage} className="space-y-2 pt-2 border-t border-[#2F3336]">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  placeholder={`Write message to send directly to ${selectedChannel?.title || 'Telegram'}...`}
                  className="flex-1 bg-black border border-[#2F3336] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#0088cc]"
                />
                <button
                  type="submit"
                  disabled={!chatInputText.trim()}
                  className="px-4 py-2.5 bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send to Telegram</span>
                </button>
              </div>
              <p className="text-[10px] text-[#71767B]">
                Messages sent here will broadcast directly to the selected Telegram channel via Telethon MTProto engine.
              </p>
            </form>

          </div>

        </div>
      )}

      {/* TAB 2: FOLLOWED CHANNELS & MANAGED BOTS MANAGER */}
      {activeTab === 'channels' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Managed Telegram Channels & Bots</h3>
            <button
              onClick={() => setIsAddingChannel(true)}
              className="px-3 py-1.5 bg-[#0088cc] text-white font-bold text-xs rounded-xl flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Channel</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {channels.map((ch) => (
              <div key={ch.id} className={`p-4 rounded-2xl bg-[#0F1419] border space-y-3 ${ch.isPrimary ? 'border-amber-400/60 shadow-lg shadow-amber-400/5' : 'border-[#2F3336]'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#0088cc]/20 border border-[#0088cc]/40 flex items-center justify-center text-[#0088cc] font-bold relative">
                      {ch.title.substring(0, 2).toUpperCase()}
                      {ch.isPrimary && (
                        <span className="absolute -top-1 -right-1 p-0.5 bg-amber-400 text-black rounded-full">
                          <Star className="w-3 h-3 fill-current" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <h4 className="text-sm font-bold text-white">{ch.title}</h4>
                        {ch.isPrimary && (
                          <span className="px-1.5 py-0.2 text-[9px] bg-amber-400/20 text-amber-300 font-bold rounded">
                            PRIMARY
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#71767B]">{ch.username}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onDeleteChannel(ch.id)}
                    className="p-1 rounded text-[#71767B] hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-[#71767B]">
                  <div className="flex justify-between">
                    <span>Role:</span>
                    <strong className="text-white uppercase">{ch.type.replace('_', ' ')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Subscribers:</span>
                    <strong className="text-white">{ch.subscribers}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Auto-Forward to X:</span>
                    <strong className={ch.autoForwardToX ? "text-emerald-400" : "text-zinc-500"}>
                      {ch.autoForwardToX ? "Enabled" : "Disabled"}
                    </strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#2F3336] flex items-center justify-between gap-2">
                  {!ch.isPrimary ? (
                    <button
                      onClick={() => onSetPrimaryChannel(ch.id)}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-300 border border-amber-500/30 hover:bg-amber-500/20"
                    >
                      Set Main
                    </button>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-400 flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Main Channel</span>
                    </span>
                  )}

                  <button
                    onClick={() => onToggleChannelActive(ch.id)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${
                      ch.isActive
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                    }`}
                  >
                    {ch.isActive ? 'Active' : 'Paused'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BI-DIRECTIONAL X ↔ TELEGRAM BRIDGE RULES */}
      {activeTab === 'bridge' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">X ↔ Telegram Automation Rules</h3>
              <p className="text-xs text-[#71767B]">Automatically relay messages between X accounts and Telegram channels</p>
            </div>
            <button
              onClick={() => setIsAddingRule(true)}
              className="px-3 py-1.5 bg-[#0088cc] text-white font-bold text-xs rounded-xl flex items-center space-x-1"
            >
              <Plus className="w-4 h-4" />
              <span>Create Bridge Rule</span>
            </button>
          </div>

          <div className="space-y-3">
            {bridgeRules.map((rule) => (
              <div key={rule.id} className="p-4 rounded-2xl bg-[#0F1419] border border-[#2F3336] flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-sm font-bold text-white">{rule.title}</h4>
                    <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-[#1D9BF0]/15 text-[#1D9BF0] border border-[#1D9BF0]/30">
                      {rule.direction.toUpperCase().replace(/_/g, ' ')}
                    </span>
                  </div>
                  <p className="text-xs text-[#71767B]">
                    Primary X Account <ArrowRight className="w-3 h-3 inline text-[#0088cc]" /> Active Telegram Channels
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                    rule.isActive ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-zinc-800 text-zinc-400 border-zinc-700'
                  }`}>
                    {rule.isActive ? 'Active Rule' : 'Inactive'}
                  </span>

                  <button
                    onClick={() => onToggleRuleActive(rule.id)}
                    className="px-3 py-1 bg-black hover:bg-[#16181C] text-xs font-semibold text-white border border-[#2F3336] rounded-lg"
                  >
                    Toggle Rule
                  </button>

                  <button
                    onClick={() => onDeleteBridgeRule(rule.id)}
                    className="p-1.5 text-[#71767B] hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: Add New Channel or Bot */}
      {isAddingChannel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0F1419] border border-[#2F3336] w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Add Telegram Channel or Bot</h3>
            
            <form onSubmit={handleCreateChannelSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#E7E9EA]">Channel / Bot Name</label>
                <input
                  type="text"
                  value={newChannelTitle}
                  onChange={(e) => setNewChannelTitle(e.target.value)}
                  placeholder="e.g. Crypto & AI News Flash"
                  className="w-full bg-black border border-[#2F3336] rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#0088cc]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#E7E9EA]">Username or ID</label>
                <input
                  type="text"
                  value={newChannelUsername}
                  onChange={(e) => setNewChannelUsername(e.target.value)}
                  placeholder="@MyChannelHandle or -10012938472"
                  className="w-full bg-black border border-[#2F3336] rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#0088cc] font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#E7E9EA]">Channel Category Type</label>
                <select
                  value={newChannelType}
                  onChange={(e) => setNewChannelType(e.target.value as any)}
                  className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#0088cc]"
                >
                  <option value="source_feed">Source Feed (Follow & aggregate incoming posts)</option>
                  <option value="managed_destination">Managed Destination (Send & broadcast X posts to)</option>
                  <option value="bot">Interactive Bot Integration</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="autoFwd"
                  checked={newAutoForwardToX}
                  onChange={(e) => setNewAutoForwardToX(e.target.checked)}
                  className="rounded border-[#2F3336] text-[#0088cc]"
                />
                <label htmlFor="autoFwd" className="text-xs text-[#E7E9EA]">
                  Auto-Forward incoming posts to X accounts
                </label>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-[#2F3336]">
                <button
                  type="button"
                  onClick={() => setIsAddingChannel(false)}
                  className="px-4 py-2 rounded-xl bg-black text-xs font-semibold text-[#71767B] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold text-xs"
                >
                  Add Channel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add Bridge Rule */}
      {isAddingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0F1419] border border-[#2F3336] w-full max-w-md rounded-2xl p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Create X ↔ Telegram Bridge Rule</h3>
            
            <form onSubmit={handleCreateRuleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#E7E9EA]">Rule Title</label>
                <input
                  type="text"
                  value={newRuleTitle}
                  onChange={(e) => setNewRuleTitle(e.target.value)}
                  placeholder="e.g. Primary X -> All Telegram Channels"
                  className="w-full bg-black border border-[#2F3336] rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#0088cc]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#E7E9EA]">Sync Flow Direction</label>
                <select
                  value={newRuleDirection}
                  onChange={(e) => setNewRuleDirection(e.target.value as any)}
                  className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#0088cc]"
                >
                  <option value="x_to_telegram">Primary X Post → Telegram Channels</option>
                  <option value="telegram_to_x">Telegram Channels → All X Accounts</option>
                  <option value="bidirectional">Bi-Directional Auto Sync</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#E7E9EA]">Keyword Filter (Optional)</label>
                <input
                  type="text"
                  value={newRuleKeywords}
                  onChange={(e) => setNewRuleKeywords(e.target.value)}
                  placeholder="e.g. #crypto, #launch, important"
                  className="w-full bg-black border border-[#2F3336] rounded-xl px-3.5 py-2 text-white text-xs focus:outline-none focus:border-[#0088cc]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="ruleAi"
                  checked={newRuleAiAdapt}
                  onChange={(e) => setNewRuleAiAdapt(e.target.checked)}
                  className="rounded border-[#2F3336] text-[#0088cc]"
                />
                <label htmlFor="ruleAi" className="text-xs text-[#E7E9EA]">
                  Use AI to adapt text format during bridge
                </label>
              </div>

              <div className="pt-3 flex justify-end space-x-2 border-t border-[#2F3336]">
                <button
                  type="button"
                  onClick={() => setIsAddingRule(false)}
                  className="px-4 py-2 rounded-xl bg-black text-xs font-semibold text-[#71767B] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#0088cc] hover:bg-[#0077b3] text-white font-bold text-xs"
                >
                  Create Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
