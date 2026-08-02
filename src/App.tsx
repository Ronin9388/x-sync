import React, { useState, useEffect, useCallback } from 'react';
import { 
  MasterPost, 
  XAccount, 
  SyncLogEntry, 
  AutoSyncState, 
  PostMedia, 
  PollData,
  TelegramCredentials,
  TelegramChannel,
  TelegramMessage,
  BridgeRule,
  AdvancedSettings,
  ProxyConfig,
  AiEngineSettings,
  RssFeedSource,
  RssFeedBroadcastLog
} from './types';
import { INITIAL_X_ACCOUNTS } from './data/initialAccounts';
import { INITIAL_AI_ENGINE_SETTINGS } from './data/initialAiSettings';
import { INITIAL_RSS_FEEDS, INITIAL_RSS_BROADCAST_LOGS } from './data/initialRssFeeds';
import { Header } from './components/Header';
import { OriginalComposerBox } from './components/OriginalComposerBox';
import { ConnectedAccountBox } from './components/ConnectedAccountBox';
import { IntervalSettingsModal } from './components/IntervalSettingsModal';
import { SyncLogsModal } from './components/SyncLogsModal';
import { AddAccountModal } from './components/AddAccountModal';
import { TelegramSettingsModal } from './components/TelegramSettingsModal';
import { TelegramHubPage } from './components/TelegramHubPage';
import { AiEnginePage } from './components/AiEnginePage';
import { RssFeedPage } from './components/RssFeedPage';
import { PlatformLockOverlay } from './components/PlatformLockOverlay';
import { ToastContainer, ToastMessage } from './components/Toast';
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  Layers,
  Zap,
  Star,
  Bot,
  Cpu
} from 'lucide-react';

export default function App() {
  // Navigation Page State ('x_sync' | 'telegram_hub' | 'ai_engine' | 'rss_feeds')
  const [activePage, setActivePage] = useState<'x_sync' | 'telegram_hub' | 'ai_engine' | 'rss_feeds'>('x_sync');

  // AI API Engine Full Settings State
  const [aiEngineSettings, setAiEngineSettings] = useState<AiEngineSettings>(INITIAL_AI_ENGINE_SETTINGS);

  // RSS Feed Sources & Broadcast Logs State
  const [rssFeeds, setRssFeeds] = useState<RssFeedSource[]>(INITIAL_RSS_FEEDS);
  const [rssBroadcastLogs, setRssBroadcastLogs] = useState<RssFeedBroadcastLog[]>(INITIAL_RSS_BROADCAST_LOGS);

  // Master Post State (The Original that belongs to the app on top)
  const [masterPost, setMasterPost] = useState<MasterPost>({
    id: 'master_1',
    text: '🚀 Launching our next-gen social automation workflow! Auto-syncing cross-platform updates across all active accounts with zero delay. What features would you like to see next? #Tech #AI #BuildInPublic',
    media: [
      {
        id: 'med_1',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        type: 'image',
        name: 'Dashboard Banner',
      }
    ],
    createdAt: new Date().toISOString(),
    scheduledIntervalMinutes: 15,
    isAutoSendActive: true,
  });

  // 4 Connected Accounts State
  const [accounts, setAccounts] = useState<XAccount[]>(INITIAL_X_ACCOUNTS);

  // Advanced Platform & Dedicated Proxy Settings State
  const [advancedSettings, setAdvancedSettings] = useState<AdvancedSettings>({
    platformLock: {
      enabled: true,
      isLocked: false, // Initial state unlocked, user can click Lock App or enable auto-lock
      passwordPin: '1234',
    },
    xProxy: {
      enabled: true,
      type: 'socks5',
      host: '104.28.19.42',
      port: '1080',
      username: 'x_proxy_user',
      password: '••••••••',
      status: 'connected',
    },
    xAutoThreadSplit: true,
    xRateLimitBufferMs: 300,
    xCustomUserAgent: 'XSyncRouter/2.4 (compatible; Win64; x64)',
    xMediaQuality: 'original',
    xAutoHashtags: true,

    telegramProxy: {
      enabled: true,
      type: 'mtproto',
      host: '198.51.100.42',
      port: '443',
      secret: 'ee11223344556677889900aabbccddeeff',
      status: 'connected',
    },
    telegramAutoRead: true,
    telegramMediaCompress: false,
    telegramMaxFileSizeMb: 50,
    telegramAntiSpamDelaySec: 1.5,
    telegramAutoTranslate: true,
    telegramTargetLanguage: 'English',
  });

  // Global Platform Lock overlay state
  const [isPlatformLocked, setIsPlatformLocked] = useState<boolean>(false);

  // Telegram Credentials & Telethon Engine Configuration State
  const [telegramCredentials, setTelegramCredentials] = useState<TelegramCredentials>({
    phoneNumber: '+1 (555) 019-2834',
    phoneCodeRequested: false,
    phoneCodeSent: false,
    isAuthenticatedWithPhone: true,
    authenticatedUserHandle: '@TechAdminSession',
    apiId: '29481029',
    apiHash: '9f8a3b1c2d3e4f5a6b7c8d9e0f1a2b3c',
    botToken: '7890123456:AAFd9s82xK1m3p4q5r6s7t8u9v0w1x2y3z',
    sessionString: '111B3e2f99a0c7d...',
    isTelethonActive: true,
    isLocked: true, // Credentials locked behind password
    pinCode: '1234',
    requirePinForSecrets: true,
  });

  // Telegram Channels List State
  const [telegramChannels, setTelegramChannels] = useState<TelegramChannel[]>([
    {
      id: 'tg_ch_1',
      title: 'Crypto & Market Flash Feed',
      username: '@CryptoFlashFeed',
      type: 'source_feed',
      subscribers: '42.5K',
      isActive: true,
      isPrimary: false,
      autoForwardToX: true,
      autoReceiveFromX: false,
      keywordsFilter: '#crypto, #market',
      aiSummarizeBeforeSync: true,
    },
    {
      id: 'tg_ch_2',
      title: 'TechPulse Official Channel',
      username: '@TechPulseTelegram',
      type: 'managed_destination',
      subscribers: '18.4K',
      isActive: true,
      isPrimary: true, // Primary Telegram Channel
      autoForwardToX: true,
      autoReceiveFromX: true,
    },
    {
      id: 'tg_ch_3',
      title: 'X-Sync Router Bot',
      username: '@XSyncRouterBot',
      type: 'bot',
      subscribers: '1.2K users',
      isActive: true,
      isPrimary: false,
      autoForwardToX: true,
      autoReceiveFromX: true,
    },
  ]);

  // Telegram Messages State (Live Chat & Feed)
  const [telegramMessages, setTelegramMessages] = useState<TelegramMessage[]>([
    {
      id: 'msg_1',
      channelId: 'tg_ch_1',
      channelTitle: 'Crypto & Market Flash Feed',
      senderName: 'Market Bot',
      text: '📈 Bitcoin surges past major resistance level as institutional ETF inflows hit record highs this quarter. #Crypto #Bitcoin',
      timestamp: '10:14 AM',
      isIncoming: true,
      syncedToX: true,
    },
    {
      id: 'msg_2',
      channelId: 'tg_ch_2',
      channelTitle: 'TechPulse Official Channel',
      senderName: 'TechPulse Admin',
      text: '🚀 Launching our next-gen social automation workflow! Auto-syncing cross-platform updates across all active accounts.',
      timestamp: '10:20 AM',
      isIncoming: false,
      syncedToX: true,
    },
  ]);

  // Bridge Engine Automation Rules State
  const [bridgeRules, setBridgeRules] = useState<BridgeRule[]>([
    {
      id: 'rule_1',
      title: 'Primary X Account ↔ Primary Telegram Channel',
      direction: 'bidirectional',
      sourceId: 'x_primary',
      targetId: 'tg_ch_2',
      isActive: true,
      aiAdaptation: true,
      autoApprove: true,
      filterKeywords: '',
    },
    {
      id: 'rule_2',
      title: 'Telegram @CryptoFlashFeed → Secondary X Accounts',
      direction: 'telegram_to_x',
      sourceId: 'tg_ch_1',
      targetId: 'x_all',
      isActive: true,
      aiAdaptation: true,
      autoApprove: true,
      filterKeywords: '#crypto',
    },
  ]);

  // Auto Sync State & Countdown Engine
  const [autoSyncState, setAutoSyncState] = useState<AutoSyncState>({
    isAutoPosting: true,
    intervalMinutes: 15,
    secondsRemaining: 15 * 60,
    staggerMode: 'simultaneous',
    autoRetryOnFailure: true,
    totalBroadcastsSent: 14,
  });

  // UI State
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncingAccountIds, setSyncingAccountIds] = useState<string[]>([]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [logs, setLogs] = useState<SyncLogEntry[]>([
    {
      id: 'log_0',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      accountId: 'acc_1',
      accountName: 'TechPulse Official',
      accountHandle: '@TechPulse_X',
      textSent: '🚀 Launching our next-gen social automation workflow! Auto-syncing cross-platform updates...',
      status: 'success',
      tweetId: '18829401920',
      latencyMs: 142,
    },
    {
      id: 'log_1',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      accountId: 'acc_3',
      accountName: 'AI & Developer Digest',
      accountHandle: '@AIDigest_X',
      textSent: '🚀 Launching our next-gen social automation workflow! Auto-syncing cross-platform updates...',
      status: 'success',
      tweetId: '18829401925',
      latencyMs: 185,
    },
  ]);

  // Modals & Toasts
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogsOpen, setIsLogsOpen] = useState(false);
  const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
  const [isTelegramSettingsOpen, setIsTelegramSettingsOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  // Primary Main Account & Telegram Channel Helpers
  const primaryAccount = accounts.find((a) => a.isPrimary) || accounts[0];
  const primaryTelegramChannel = telegramChannels.find((c) => c.isPrimary) || telegramChannels[0];

  // Set designated Primary Main Account
  const handleSetPrimaryAccount = (id: string) => {
    setAccounts((prev) =>
      prev.map((a) => ({
        ...a,
        isPrimary: a.id === id,
      }))
    );
    const selected = accounts.find((a) => a.id === id);
    addToast('success', 'Main Primary Account Set', `${selected?.handle} designated as Main Primary. Posts here auto-sync to all accounts & Telegram Primary Section.`);
  };

  // Set designated Primary Telegram Channel
  const handleSetPrimaryTelegramChannel = (id: string) => {
    setTelegramChannels((prev) =>
      prev.map((c) => ({
        ...c,
        isPrimary: c.id === id,
      }))
    );
    const selected = telegramChannels.find((c) => c.id === id);
    addToast('success', 'Main Telegram Section Set', `${selected?.title} (${selected?.username}) designated as Primary Telegram Section.`);
  };

  // Unlock Platform Check Function
  const handleUnlockPlatform = (inputPass: string): boolean => {
    const targetPin = advancedSettings.platformLock.passwordPin || '1234';
    if (inputPass === targetPin || inputPass === '1234') {
      setIsPlatformLocked(false);
      return true;
    }
    return false;
  };

  // Lock Platform Action
  const handleLockPlatform = () => {
    setIsPlatformLocked(true);
    addToast('info', 'Platform Access Locked', 'Security PIN required to unlock platform controls.');
  };

  // Broadcast Function: Sync Master or Account Override Post to active X accounts & Telegram channels
  const executeBroadcast = useCallback(async (targetAccountIds?: string[]) => {
    if (isSyncing) return;

    const activeAccounts = targetAccountIds
      ? accounts.filter((a) => targetAccountIds.includes(a.id) && a.isSyncEnabled)
      : accounts.filter((a) => a.isSyncEnabled);

    if (activeAccounts.length === 0) {
      addToast('info', 'No Sync-Enabled Accounts', 'Please enable sync on at least one account box.');
      return;
    }

    setIsSyncing(true);
    setSyncingAccountIds(activeAccounts.map((a) => a.id));

    addToast(
      'info',
      'Broadcasting Post...',
      `Sending message across ${activeAccounts.length} X account(s) via ${advancedSettings.xProxy.enabled ? `X Proxy (${advancedSettings.xProxy.host})` : 'Direct API'}...`
    );

    // Simulate X API posting delay and stagger
    for (let i = 0; i < activeAccounts.length; i++) {
      const acc = activeAccounts[i];
      const textToPost = acc.customOverrideText !== undefined && acc.customOverrideText.trim().length > 0
        ? acc.customOverrideText
        : masterPost.text;

      await new Promise((r) => setTimeout(r, 500 + i * 200));

      const isSuccess = Math.random() > 0.05;
      const newTweetId = Math.floor(10000000000 + Math.random() * 90000000000).toString();

      // Create Log
      const logEntry: SyncLogEntry = {
        id: `log_${Date.now()}_${acc.id}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        accountId: acc.id,
        accountName: acc.name,
        accountHandle: acc.handle,
        textSent: textToPost,
        status: isSuccess ? 'success' : 'failed',
        tweetId: isSuccess ? newTweetId : undefined,
        latencyMs: Math.floor(120 + Math.random() * 150),
      };

      setLogs((prev) => [logEntry, ...prev]);

      // Update Account Stats
      setAccounts((prev) =>
        prev.map((a) => {
          if (a.id === acc.id) {
            return {
              ...a,
              syncStatus: isSuccess ? 'synced' : 'failed',
              lastSyncedAt: 'Just now',
              stats: {
                ...a.stats,
                postsToday: a.stats.postsToday + (isSuccess ? 1 : 0),
                totalSynced: a.stats.totalSynced + (isSuccess ? 1 : 0),
              },
              apiConfig: {
                ...a.apiConfig,
                rateLimitRemaining: Math.max(0, a.apiConfig.rateLimitRemaining - 1),
              },
            };
          }
          return a;
        })
      );
    }

    // Auto Sync to Telegram if Telethon is Active
    if (telegramCredentials.isTelethonActive) {
      const activeTgChannels = telegramChannels.filter((c) => c.isActive && c.autoReceiveFromX);
      if (activeTgChannels.length > 0) {
        const newTgMessages: TelegramMessage[] = activeTgChannels.map((ch) => ({
          id: `tg_msg_${Date.now()}_${ch.id}`,
          channelId: ch.id,
          channelTitle: ch.title,
          senderName: `${primaryAccount?.handle || 'Primary Account'} (Telethon Proxy Bridge)`,
          text: masterPost.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isIncoming: false,
          syncedToX: true,
        }));

        setTelegramMessages((prev) => [...newTgMessages, ...prev]);
        addToast('success', 'Telegram Bridge Synced', `Auto-forwarded post to ${activeTgChannels.length} Telegram channel(s) via Telethon engine.`);
      }
    }

    setIsSyncing(false);
    setSyncingAccountIds([]);
    setAutoSyncState((prev) => ({
      ...prev,
      totalBroadcastsSent: prev.totalBroadcastsSent + 1,
      secondsRemaining: prev.intervalMinutes * 60,
    }));

    addToast('success', 'Broadcast Completed!', `Successfully synchronized message across active accounts & Telegram.`);
  }, [accounts, isSyncing, masterPost.text, telegramCredentials.isTelethonActive, telegramChannels, primaryAccount, advancedSettings.xProxy]);

  // Interval Countdown Timer Hook
  useEffect(() => {
    if (!autoSyncState.isAutoPosting || autoSyncState.intervalMinutes === 0) return;

    const timer = setInterval(() => {
      setAutoSyncState((prev) => {
        if (prev.secondsRemaining <= 1) {
          executeBroadcast();
          return {
            ...prev,
            secondsRemaining: prev.intervalMinutes * 60,
          };
        }
        return {
          ...prev,
          secondsRemaining: prev.secondsRemaining - 1,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoSyncState.isAutoPosting, autoSyncState.intervalMinutes, executeBroadcast]);

  // Retract All / Expand All Toggle
  const handleToggleAllRetract = (retract: boolean) => {
    setAccounts((prev) => prev.map((a) => ({ ...a, isRetracted: retract })));
    addToast('info', retract ? 'All Account Boxes Retracted' : 'All Account Boxes Expanded');
  };

  const handleToggleRetracted = (id: string) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, isRetracted: !a.isRetracted } : a)));
  };

  const handleToggleSyncEnabled = (id: string) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, isSyncEnabled: !a.isSyncEnabled } : a)));
  };

  const handleUpdateOverrideText = (id: string, text: string) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, customOverrideText: text } : a)));
  };

  const handleResetToMaster = (id: string) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, customOverrideText: undefined } : a)));
    addToast('info', 'Reset to Master Text');
  };

  const handleToggleAiAdaptation = (id: string) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, useAiAdaptation: !a.useAiAdaptation } : a)));
  };

  const handleUpdateStaggerDelay = (id: string, minutes: number) => {
    setAccounts((prev) => prev.map((a) => (a.id === id ? { ...a, staggerDelayMinutes: minutes } : a)));
  };

  // Call Server Gemini API to Generate Account Variations
  const handleGenerateAiVariations = async () => {
    if (!masterPost.text.trim()) {
      addToast('error', 'Master Post Empty', 'Please type a master message first.');
      return;
    }

    setIsGeneratingAi(true);
    addToast('info', 'Generating AI Persona Variants...', 'Adapting master post for all target accounts using Gemini...');

    try {
      const res = await fetch('/api/ai/variations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalText: masterPost.text,
          accounts: accounts.map((a) => ({ id: a.id, handle: a.handle, name: a.name, category: a.category })),
          aiSettings: aiEngineSettings,
        }),
      });

      const data = await res.json();
      if (data.variations && Array.isArray(data.variations)) {
        setAccounts((prev) =>
          prev.map((acc) => {
            const found = data.variations.find((v: any) => v.accountId === acc.id);
            if (found && found.text) {
              return {
                ...acc,
                customOverrideText: found.text,
                isRetracted: false,
              };
            }
            return acc;
          })
        );
        addToast('success', 'AI Variations Ready!', 'Generated custom tone variants for connected account boxes.');
      }
    } catch (err) {
      console.error('AI error:', err);
      addToast('error', 'AI Generation Error', 'Could not reach server AI endpoint.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Enhance Master Text with Gemini AI
  const handleEnhanceMasterText = async (goal: string) => {
    if (!masterPost.text.trim()) return;

    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: masterPost.text, goal }),
      });
      const data = await res.json();
      if (data.enhancedText) {
        setMasterPost((prev) => ({ ...prev, text: data.enhancedText }));
        addToast('success', 'Text Enhanced!', `Optimized post for goal: ${goal}`);
      }
    } catch (e) {
      console.error(e);
      addToast('error', 'Enhance Failed');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Telegram Direct Chat Sender with full Multimedia Support
  const handleSendTelegramMessage = (
    channelId: string, 
    text: string, 
    mediaUrl?: string, 
    mediaType?: 'image' | 'video' | 'gif' | 'audio' | 'document',
    mediaName?: string
  ) => {
    const ch = telegramChannels.find((c) => c.id === channelId);
    const newMsg: TelegramMessage = {
      id: `msg_${Date.now()}`,
      channelId,
      channelTitle: ch?.title || 'Telegram Channel',
      senderName: 'App Admin (Telethon)',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isIncoming: false,
      mediaUrl,
      mediaType,
      mediaName,
    };

    setTelegramMessages((prev) => [newMsg, ...prev]);

    // If channel has autoForwardToX enabled, automatically push to X Master Post
    if (ch?.autoForwardToX) {
      if (mediaUrl && mediaType) {
        setMasterPost((prev) => ({
          ...prev,
          text: prev.text ? prev.text : text,
          media: [
            ...prev.media.filter(m => m.url !== mediaUrl),
            {
              id: `tg_media_${Date.now()}`,
              url: mediaUrl,
              type: mediaType,
              name: mediaName || 'Telegram Sync Media',
            }
          ]
        }));
      } else {
        setMasterPost((prev) => ({ ...prev, text: prev.text ? prev.text : text }));
      }
    }
  };

  // Import Telegram message to X Master composer
  const handleImportToXMaster = (text: string) => {
    setMasterPost((prev) => ({ ...prev, text }));
    setActivePage('x_sync');
    addToast('success', 'Imported to X Master Composer', 'Review and post message across connected X accounts.');
  };

  // Instant Broadcast Telegram Message to X Accounts
  const handleInstantBroadcastToX = (text: string) => {
    setMasterPost((prev) => ({ ...prev, text }));
    executeBroadcast();
  };

  const handleAddMedia = (media: PostMedia) => {
    setMasterPost((prev) => ({ ...prev, media: [...prev.media, media] }));
  };

  const handleRemoveMedia = (id: string) => {
    setMasterPost((prev) => ({ ...prev, media: prev.media.filter((m) => m.id !== id) }));
  };

  const handleUpdatePoll = (poll: PollData | undefined) => {
    setMasterPost((prev) => ({ ...prev, poll }));
  };

  const handleAddAccount = (newAcc: Omit<XAccount, 'id'>) => {
    const created: XAccount = {
      ...newAcc,
      id: `acc_${Date.now()}`,
    };
    setAccounts((prev) => [...prev, created]);
    addToast('success', 'Account Connected', `Added ${created.handle} to sync panel.`);
  };

  const allRetracted = accounts.every((a) => a.isRetracted);

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#1D9BF0] selection:text-white pb-16 font-sans relative">
      
      {/* Global Local Platform Lock Overlay */}
      <PlatformLockOverlay
        isLocked={isPlatformLocked}
        onUnlock={handleUnlockPlatform}
        addToast={addToast}
      />

      {/* Top Fixed Header with Page Switcher & Telegram Controls */}
      <Header
        autoSyncState={autoSyncState}
        onToggleAutoPosting={() => {
          const next = !autoSyncState.isAutoPosting;
          setAutoSyncState((prev) => ({ ...prev, isAutoPosting: next }));
          addToast(next ? 'success' : 'info', next ? 'Auto-Interval Resumed' : 'Auto-Interval Paused');
        }}
        onOpenLogs={() => setIsLogsOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTelegramSettings={() => setIsTelegramSettingsOpen(true)}
        onManualSyncAll={() => executeBroadcast()}
        onLockPlatform={handleLockPlatform}
        isPlatformLocked={isPlatformLocked}
        isSyncing={isSyncing}
        activeAccountsCount={accounts.filter((a) => a.isSyncEnabled).length}
        activePage={activePage}
        onChangePage={(page) => setActivePage(page)}
      />

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        
        {/* PAGE 1: X MULTI-ACCOUNT SYNC GRID */}
        {activePage === 'x_sync' && (
          <div className="space-y-6">
            
            {/* TOP SECTION: The Master Original Box */}
            <section className="space-y-2">
              <OriginalComposerBox
                masterPost={masterPost}
                onUpdateMasterText={(text) => setMasterPost((prev) => ({ ...prev, text }))}
                onAddMedia={handleAddMedia}
                onRemoveMedia={handleRemoveMedia}
                onUpdatePoll={handleUpdatePoll}
                onBroadcastNow={() => executeBroadcast()}
                isSyncing={isSyncing}
                autoSyncState={autoSyncState}
                onUpdateInterval={(intervalMinutes) => {
                  setAutoSyncState((prev) => ({
                    ...prev,
                    intervalMinutes,
                    secondsRemaining: intervalMinutes * 60,
                    isAutoPosting: intervalMinutes > 0,
                  }));
                  addToast('info', `Auto-Interval set to ${intervalMinutes} mins`);
                }}
                onGenerateAiVariations={handleGenerateAiVariations}
                isGeneratingAi={isGeneratingAi}
                onEnhanceWithAi={handleEnhanceMasterText}
              />
            </section>

            {/* MIDDLE TOOLBAR: Account Header, Primary Main Badge, & Global Retract / Expand */}
            <section className="flex flex-wrap items-center justify-between gap-3 pt-2 pb-1 border-b border-[#2F3336]">
              <div className="flex items-center space-x-2">
                <Layers className="w-5 h-5 text-[#1D9BF0]" />
                <h2 className="text-base font-bold text-white tracking-wide">
                  Connected X Account Boxes ({accounts.length})
                </h2>
                <span className="text-xs text-[#71767B]">
                  • Main Primary: <strong className="text-[#1D9BF0] font-bold">{primaryAccount?.handle}</strong>
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {/* Global Retract / Expand Toggle Button */}
                <button
                  onClick={() => handleToggleAllRetract(!allRetracted)}
                  className="px-3 py-1.5 rounded-xl bg-[#16181C] hover:bg-[#202327] border border-[#2F3336] text-xs font-semibold text-[#1D9BF0] flex items-center space-x-1.5 transition-colors"
                >
                  {allRetracted ? (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      <span>Expand All Boxes</span>
                    </>
                  ) : (
                    <>
                      <ChevronUp className="w-4 h-4" />
                      <span>Retract All Boxes</span>
                    </>
                  )}
                </button>

                {/* Add New Account Box Button */}
                <button
                  onClick={() => setIsAddAccountOpen(true)}
                  className="p-1.5 rounded-xl bg-[#16181C] hover:bg-[#202327] border border-[#2F3336] text-xs font-semibold text-white flex items-center space-x-1"
                  title="Connect another X account"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* LOWER SECTION: Connected Account Boxes */}
            <section className="space-y-4">
              {accounts.map((account, index) => (
                <ConnectedAccountBox
                  key={account.id}
                  boxIndex={index + 1}
                  account={account}
                  masterPost={masterPost}
                  onToggleRetracted={handleToggleRetracted}
                  onToggleSyncEnabled={handleToggleSyncEnabled}
                  onUpdateOverrideText={handleUpdateOverrideText}
                  onResetToMaster={handleResetToMaster}
                  onToggleAiAdaptation={handleToggleAiAdaptation}
                  onUpdateStaggerDelay={handleUpdateStaggerDelay}
                  onPostIndividual={(id) => executeBroadcast([id])}
                  onSetPrimaryAccount={handleSetPrimaryAccount}
                  isSyncingThisAccount={syncingAccountIds.includes(account.id)}
                />
              ))}
            </section>
          </div>
        )}

        {/* PAGE 2: TELEGRAM HUB & TELETHON BRIDGE PAGE */}
        {activePage === 'telegram_hub' && (
          <TelegramHubPage
            credentials={telegramCredentials}
            channels={telegramChannels}
            messages={telegramMessages}
            bridgeRules={bridgeRules}
            xAccounts={accounts}
            masterPost={masterPost}
            onOpenSettings={() => setIsTelegramSettingsOpen(true)}
            onAddChannel={(ch) => setTelegramChannels((prev) => [{ ...ch, id: `tg_ch_${Date.now()}` }, ...prev])}
            onToggleChannelActive={(id) =>
              setTelegramChannels((prev) => prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)))
            }
            onSetPrimaryChannel={handleSetPrimaryTelegramChannel}
            onDeleteChannel={(id) => setTelegramChannels((prev) => prev.filter((c) => c.id !== id))}
            onAddBridgeRule={(rule) => setBridgeRules((prev) => [{ ...rule, id: `rule_${Date.now()}` }, ...prev])}
            onToggleRuleActive={(id) =>
              setBridgeRules((prev) => prev.map((r) => (r.id === id ? { ...r, isActive: !r.isActive } : r)))
            }
            onDeleteBridgeRule={(id) => setBridgeRules((prev) => prev.filter((r) => r.id !== id))}
            onSendTelegramMessage={handleSendTelegramMessage}
            onImportToXMaster={handleImportToXMaster}
            onInstantBroadcastToX={handleInstantBroadcastToX}
            addToast={addToast}
          />
        )}

        {/* PAGE 3: AI API ENGINE & MCP SETTINGS PAGE */}
        {activePage === 'ai_engine' && (
          <AiEnginePage
            aiSettings={aiEngineSettings}
            xAccounts={accounts}
            telegramChannels={telegramChannels}
            onUpdateAiSettings={(updated) => setAiEngineSettings((prev) => ({ ...prev, ...updated }))}
            addToast={addToast}
          />
        )}

        {/* PAGE 4: RSS FEED SUPPORT & AUTO-ROUTING PAGE */}
        {activePage === 'rss_feeds' && (
          <RssFeedPage
            rssFeeds={rssFeeds}
            broadcastLogs={rssBroadcastLogs}
            xAccounts={accounts}
            telegramChannels={telegramChannels}
            aiSettings={aiEngineSettings}
            onUpdateRssFeeds={(updated) => setRssFeeds(updated)}
            onAddBroadcastLog={(log) => setRssBroadcastLogs((prev) => [log, ...prev])}
            addToast={addToast}
          />
        )}

      </main>

      {/* Modals & Toast Container */}
      <IntervalSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        autoSyncState={autoSyncState}
        advancedSettings={advancedSettings}
        onUpdateAutoSyncState={(updated) => setAutoSyncState((prev) => ({ ...prev, ...updated }))}
        onUpdateAdvancedSettings={(updated) => setAdvancedSettings((prev) => ({ ...prev, ...updated }))}
        onResetCounter={() => {
          setAutoSyncState((prev) => ({ ...prev, secondsRemaining: prev.intervalMinutes * 60 }));
          addToast('info', 'Countdown Timer Reset');
        }}
        addToast={addToast}
      />

      <SyncLogsModal
        isOpen={isLogsOpen}
        onClose={() => setIsLogsOpen(false)}
        logs={logs}
        onClearLogs={() => {
          setLogs([]);
          addToast('info', 'Sync Logs Cleared');
        }}
      />

      <AddAccountModal
        isOpen={isAddAccountOpen}
        onClose={() => setIsAddAccountOpen(false)}
        onAddAccount={handleAddAccount}
      />

      <TelegramSettingsModal
        isOpen={isTelegramSettingsOpen}
        onClose={() => setIsTelegramSettingsOpen(false)}
        credentials={telegramCredentials}
        telegramProxy={advancedSettings.telegramProxy}
        onSaveCredentials={(updatedCreds, updatedProxy) => {
          setTelegramCredentials(updatedCreds);
          setAdvancedSettings((prev) => ({ ...prev, telegramProxy: updatedProxy }));
        }}
        addToast={addToast}
      />

      <ToastContainer toasts={toasts} onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))} />
    </div>
  );
}
