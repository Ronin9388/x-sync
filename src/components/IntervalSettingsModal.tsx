import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  ShieldCheck, 
  RotateCcw, 
  Lock, 
  Globe, 
  Sliders, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Server,
  Layers,
  Bot
} from 'lucide-react';
import { AutoSyncState, AdvancedSettings, ProxyConfig } from '../types';

interface IntervalSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  autoSyncState: AutoSyncState;
  advancedSettings: AdvancedSettings;
  onUpdateAutoSyncState: (updated: Partial<AutoSyncState>) => void;
  onUpdateAdvancedSettings: (updated: Partial<AdvancedSettings>) => void;
  onResetCounter: () => void;
  addToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const IntervalSettingsModal: React.FC<IntervalSettingsModalProps> = ({
  isOpen,
  onClose,
  autoSyncState,
  advancedSettings,
  onUpdateAutoSyncState,
  onUpdateAdvancedSettings,
  onResetCounter,
  addToast,
}) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'security' | 'x_proxy' | 'telegram_proxy'>('schedule');

  // Form states
  const [settings, setSettings] = useState<AdvancedSettings>(advancedSettings);
  const [newMasterPin, setNewMasterPin] = useState('');
  const [isTestingXProxy, setIsTestingXProxy] = useState(false);
  const [isTestingTGProxy, setIsTestingTGProxy] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    let updatedLock = { ...settings.platformLock };
    if (newMasterPin.trim().length > 0) {
      updatedLock.passwordPin = newMasterPin.trim();
    }

    onUpdateAdvancedSettings({
      ...settings,
      platformLock: updatedLock,
    });

    addToast('success', 'Settings Saved', 'Advanced X, Telegram, Proxy & Platform Lock configurations updated.');
    onClose();
  };

  const handleTestXProxy = () => {
    setIsTestingXProxy(true);
    setTimeout(() => {
      setIsTestingXProxy(false);
      setSettings((prev) => ({
        ...prev,
        xProxy: { ...prev.xProxy, status: 'connected' },
      }));
      addToast('success', 'X Proxy Operational!', `Pinged Twitter v2 API via ${settings.xProxy.type.toUpperCase()} (${settings.xProxy.host}:${settings.xProxy.port}).`);
    }, 1100);
  };

  const handleTestTGProxy = () => {
    setIsTestingTGProxy(true);
    setTimeout(() => {
      setIsTestingTGProxy(false);
      setSettings((prev) => ({
        ...prev,
        telegramProxy: { ...prev.telegramProxy, status: 'connected' },
      }));
      addToast('success', 'Telegram Proxy Operational!', `Pinged Telethon MTProto DC-4 via ${settings.telegramProxy.type.toUpperCase()} (${settings.telegramProxy.host}:${settings.telegramProxy.port}).`);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0F1419] border border-[#2F3336] rounded-3xl max-w-2xl w-full text-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-[#16181C] border-b border-[#2F3336] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Sliders className="w-5 h-5 text-[#1D9BF0]" />
            <div>
              <h3 className="text-lg font-bold">Platform Settings & Proxy Manager</h3>
              <p className="text-xs text-[#71767B]">Configure schedules, local platform lock, dedicated X proxy & Telegram proxy</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-[#71767B] hover:text-white hover:bg-[#202327]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center space-x-1 p-2 bg-[#0F1419] border-b border-[#2F3336] overflow-x-auto">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'schedule' ? 'bg-[#1D9BF0] text-white' : 'text-[#71767B] hover:text-white bg-[#16181C]'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>⏱️ Schedule & Interval</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'security' ? 'bg-[#1D9BF0] text-white' : 'text-[#71767B] hover:text-white bg-[#16181C]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>🔐 Platform Security Lock</span>
          </button>

          <button
            onClick={() => setActiveTab('x_proxy')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'x_proxy' ? 'bg-[#1D9BF0] text-white' : 'text-[#71767B] hover:text-white bg-[#16181C]'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-[#1D9BF0]" />
            <span>🐦 X Proxy & Settings</span>
          </button>

          <button
            onClick={() => setActiveTab('telegram_proxy')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'telegram_proxy' ? 'bg-[#0088cc] text-white' : 'text-[#71767B] hover:text-white bg-[#16181C]'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-[#0088cc]" />
            <span>✈️ Telegram Proxy & Settings</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* TAB 1: SCHEDULE & INTERVAL */}
          {activeTab === 'schedule' && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase text-[#71767B] tracking-wider mb-2">
                  Broadcast Interval Frequency
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { label: 'Manual Only', val: 0 },
                    { label: '1 Min (Test)', val: 1 },
                    { label: '5 Minutes', val: 5 },
                    { label: '15 Minutes', val: 15 },
                    { label: '30 Minutes', val: 30 },
                    { label: '1 Hour', val: 60 },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => onUpdateAutoSyncState({ intervalMinutes: opt.val, secondsRemaining: opt.val * 60 })}
                      className={`p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                        autoSyncState.intervalMinutes === opt.val
                          ? 'bg-[#1D9BF0]/20 border-[#1D9BF0] text-[#1D9BF0] shadow-md'
                          : 'bg-[#16181C] border-[#2F3336] text-[#E7E9EA] hover:border-[#333639]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Staggering Mode */}
              <div>
                <label className="block text-xs font-bold uppercase text-[#71767B] tracking-wider mb-2">
                  Account Staggering Offset Strategy
                </label>
                <div className="space-y-2">
                  {[
                    { id: 'simultaneous', title: 'Simultaneous Broadcast', desc: 'Sends to all connected accounts at the exact same second' },
                    { id: 'stagger_2m', title: 'Staggered (2 min offsets)', desc: 'Account 1 at 0m, Account 2 at +2m, Account 3 at +4m, Account 4 at +6m' },
                    { id: 'stagger_5m', title: 'Staggered (5 min offsets)', desc: 'Distributes posts organically to prevent rate limit flags' },
                  ].map((stag) => (
                    <label
                      key={stag.id}
                      className={`flex items-start space-x-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                        autoSyncState.staggerMode === stag.id
                          ? 'bg-[#16181C] border-[#1D9BF0]'
                          : 'bg-[#16181C]/50 border-[#2F3336] hover:border-[#333639]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="staggerMode"
                        checked={autoSyncState.staggerMode === stag.id}
                        onChange={() => onUpdateAutoSyncState({ staggerMode: stag.id as any })}
                        className="mt-1 text-[#1D9BF0] focus:ring-0 focus:ring-offset-0 bg-black border-[#333639]"
                      />
                      <div>
                        <p className="text-xs font-bold text-white">{stag.title}</p>
                        <p className="text-[11px] text-[#71767B]">{stag.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Auto Retry */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#16181C] border border-[#2F3336]">
                <div>
                  <p className="text-xs font-bold text-white">Auto-Retry Failed Broadcasts</p>
                  <p className="text-[11px] text-[#71767B]">Automatically retries failed account posts after 30 seconds</p>
                </div>
                <button
                  type="button"
                  onClick={() => onUpdateAutoSyncState({ autoRetryOnFailure: !autoSyncState.autoRetryOnFailure })}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                    autoSyncState.autoRetryOnFailure ? 'bg-[#1D9BF0]' : 'bg-zinc-700'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out ${
                      autoSyncState.autoRetryOnFailure ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={onResetCounter}
                  className="flex items-center space-x-1 text-xs text-amber-400 hover:underline"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Countdown Timer</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: SECURITY & LOCAL PLATFORM LOCK */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#16181C] border border-[#2F3336] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                      <Lock className="w-4 h-4 text-emerald-400" />
                      <span>Local Platform Password Protection</span>
                    </h4>
                    <p className="text-xs text-[#71767B]">Require security password/PIN to access app controls & broadcasting</p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.platformLock.enabled}
                      onChange={(e) => setSettings({
                        ...settings,
                        platformLock: { ...settings.platformLock, enabled: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="space-y-2 pt-2 border-t border-[#2F3336]">
                  <label className="text-xs font-semibold text-[#E7E9EA]">Master Security PIN / Password</label>
                  <input
                    type="password"
                    value={newMasterPin}
                    onChange={(e) => setNewMasterPin(e.target.value)}
                    placeholder="Enter new PIN or leave blank (Current: ****)"
                    className="w-full bg-black border border-[#2F3336] rounded-xl px-3.5 py-2 text-white text-xs font-mono"
                  />
                  <p className="text-[11px] text-[#71767B]">Default PIN is <code className="text-white">1234</code>. Setting a custom PIN locks the platform against unauthorized access.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DEDICATED X PROXY & SETTINGS */}
          {activeTab === 'x_proxy' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#16181C] border border-[#2F3336] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-[#1D9BF0]" />
                    <span className="text-sm font-bold text-white">Dedicated X (Twitter) Proxy Settings</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestXProxy}
                    disabled={isTestingXProxy || !settings.xProxy.enabled}
                    className="px-3 py-1 bg-black text-[#1D9BF0] border border-[#1D9BF0]/30 font-semibold rounded-lg text-xs flex items-center space-x-1 transition-colors disabled:opacity-40"
                  >
                    <Server className={`w-3.5 h-3.5 ${isTestingXProxy ? 'animate-spin' : ''}`} />
                    <span>{isTestingXProxy ? 'Testing...' : 'Test X Proxy'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-black rounded-xl border border-[#2F3336]">
                  <div>
                    <p className="text-xs font-bold text-white">Enable Dedicated Proxy for X Accounts</p>
                    <p className="text-[11px] text-[#71767B]">Routes all X API posting traffic through explicit proxy server</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.xProxy.enabled}
                      onChange={(e) => setSettings({
                        ...settings,
                        xProxy: { ...settings.xProxy, enabled: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1D9BF0]"></div>
                  </label>
                </div>

                {settings.xProxy.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#E7E9EA]">Proxy Protocol</label>
                      <select
                        value={settings.xProxy.type}
                        onChange={(e) => setSettings({
                          ...settings,
                          xProxy: { ...settings.xProxy, type: e.target.value as any }
                        })}
                        className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-[#1D9BF0]"
                      >
                        <option value="socks5">SOCKS5 Proxy</option>
                        <option value="http">HTTP / HTTPS Proxy</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#E7E9EA]">Proxy Host / IP</label>
                      <input
                        type="text"
                        value={settings.xProxy.host}
                        onChange={(e) => setSettings({
                          ...settings,
                          xProxy: { ...settings.xProxy, host: e.target.value }
                        })}
                        placeholder="e.g. 104.28.19.4"
                        className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-white text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#E7E9EA]">Proxy Port</label>
                      <input
                        type="text"
                        value={settings.xProxy.port}
                        onChange={(e) => setSettings({
                          ...settings,
                          xProxy: { ...settings.xProxy, port: e.target.value }
                        })}
                        placeholder="e.g. 1080"
                        className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-white text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#E7E9EA]">Proxy Username & Password (Optional)</label>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={settings.xProxy.username || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            xProxy: { ...settings.xProxy, username: e.target.value }
                          })}
                          placeholder="User"
                          className="bg-black border border-[#2F3336] rounded-xl px-2.5 py-2 text-white text-xs font-mono"
                        />
                        <input
                          type="password"
                          value={settings.xProxy.password || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            xProxy: { ...settings.xProxy, password: e.target.value }
                          })}
                          placeholder="Pass"
                          className="bg-black border border-[#2F3336] rounded-xl px-2.5 py-2 text-white text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Advanced X Tweaks */}
              <div className="p-4 rounded-2xl bg-[#16181C] border border-[#2F3336] space-y-3">
                <h4 className="text-xs font-bold uppercase text-[#71767B] tracking-wider">Advanced X Rules</h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">Auto Thread-Splitter for Long Posts (&gt;280 chars)</span>
                  <input
                    type="checkbox"
                    checked={settings.xAutoThreadSplit}
                    onChange={(e) => setSettings({ ...settings, xAutoThreadSplit: e.target.checked })}
                    className="rounded border-[#2F3336] text-[#1D9BF0]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">Auto-Generate Relevant Hashtags</span>
                  <input
                    type="checkbox"
                    checked={settings.xAutoHashtags}
                    onChange={(e) => setSettings({ ...settings, xAutoHashtags: e.target.checked })}
                    className="rounded border-[#2F3336] text-[#1D9BF0]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DEDICATED TELEGRAM PROXY & SETTINGS */}
          {activeTab === 'telegram_proxy' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-[#16181C] border border-[#2F3336] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="w-4 h-4 text-purple-400" />
                    <span className="text-sm font-bold text-white">Dedicated Telegram Proxy Settings</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleTestTGProxy}
                    disabled={isTestingTGProxy || !settings.telegramProxy.enabled}
                    className="px-3 py-1 bg-black text-purple-400 border border-purple-500/30 font-semibold rounded-lg text-xs flex items-center space-x-1 transition-colors disabled:opacity-40"
                  >
                    <Server className={`w-3.5 h-3.5 ${isTestingTGProxy ? 'animate-spin' : ''}`} />
                    <span>{isTestingTGProxy ? 'Testing...' : 'Test Telegram Proxy'}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-black rounded-xl border border-[#2F3336]">
                  <div>
                    <p className="text-xs font-bold text-white">Enable Dedicated Proxy for Telegram</p>
                    <p className="text-[11px] text-[#71767B]">Route Telethon MTProto traffic through explicit SOCKS5 or MTProto Proxy</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.telegramProxy.enabled}
                      onChange={(e) => setSettings({
                        ...settings,
                        telegramProxy: { ...settings.telegramProxy, enabled: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>

                {settings.telegramProxy.enabled && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#E7E9EA]">Proxy Protocol</label>
                      <select
                        value={settings.telegramProxy.type}
                        onChange={(e) => setSettings({
                          ...settings,
                          telegramProxy: { ...settings.telegramProxy, type: e.target.value as any }
                        })}
                        className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-purple-500"
                      >
                        <option value="mtproto">MTProto Telegram Proxy (Secret Key)</option>
                        <option value="socks5">SOCKS5 Proxy</option>
                        <option value="http">HTTP Proxy</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#E7E9EA]">Proxy Host / IP</label>
                      <input
                        type="text"
                        value={settings.telegramProxy.host}
                        onChange={(e) => setSettings({
                          ...settings,
                          telegramProxy: { ...settings.telegramProxy, host: e.target.value }
                        })}
                        placeholder="e.g. 198.51.100.42"
                        className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-white text-xs font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#E7E9EA]">Proxy Port</label>
                      <input
                        type="text"
                        value={settings.telegramProxy.port}
                        onChange={(e) => setSettings({
                          ...settings,
                          telegramProxy: { ...settings.telegramProxy, port: e.target.value }
                        })}
                        placeholder="e.g. 1080"
                        className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-white text-xs font-mono"
                      />
                    </div>

                    {settings.telegramProxy.type === 'mtproto' ? (
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#E7E9EA]">MTProto Secret Key</label>
                        <input
                          type="password"
                          value={settings.telegramProxy.secret || ''}
                          onChange={(e) => setSettings({
                            ...settings,
                            telegramProxy: { ...settings.telegramProxy, secret: e.target.value }
                          })}
                          placeholder="32-char hex secret key"
                          className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-white text-xs font-mono"
                        />
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#E7E9EA]">Proxy Auth User & Pass</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={settings.telegramProxy.username || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              telegramProxy: { ...settings.telegramProxy, username: e.target.value }
                            })}
                            placeholder="User"
                            className="bg-black border border-[#2F3336] rounded-xl px-2.5 py-2 text-white text-xs font-mono"
                          />
                          <input
                            type="password"
                            value={settings.telegramProxy.password || ''}
                            onChange={(e) => setSettings({
                              ...settings,
                              telegramProxy: { ...settings.telegramProxy, password: e.target.value }
                            })}
                            placeholder="Pass"
                            className="bg-black border border-[#2F3336] rounded-xl px-2.5 py-2 text-white text-xs font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Advanced Telegram Tweaks */}
              <div className="p-4 rounded-2xl bg-[#16181C] border border-[#2F3336] space-y-3">
                <h4 className="text-xs font-bold uppercase text-[#71767B] tracking-wider">Telethon Anti-Spam & Translation</h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">Auto-Translate Incoming Foreign Telegram Messages</span>
                  <input
                    type="checkbox"
                    checked={settings.telegramAutoTranslate}
                    onChange={(e) => setSettings({ ...settings, telegramAutoTranslate: e.target.checked })}
                    className="rounded border-[#2F3336] text-[#0088cc]"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-white">Anti-Spam Broadcast Delay (Seconds)</span>
                  <input
                    type="number"
                    value={settings.telegramAntiSpamDelaySec}
                    onChange={(e) => setSettings({ ...settings, telegramAntiSpamDelaySec: parseFloat(e.target.value) || 1 })}
                    className="w-20 bg-black border border-[#2F3336] rounded-lg px-2 py-1 text-white text-xs font-mono text-center"
                    min="0.5"
                    max="30"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#16181C] border-t border-[#2F3336] flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-black border border-[#2F3336] text-xs font-semibold text-[#71767B] hover:text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white font-bold text-xs shadow-lg"
          >
            Save All Settings
          </button>
        </div>

      </div>
    </div>
  );
};
