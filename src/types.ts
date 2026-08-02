export type SyncStatus = 'idle' | 'scheduled' | 'sending' | 'synced' | 'failed' | 'paused';

export interface XAccountStats {
  postsToday: number;
  totalSynced: number;
  avgImpressions: string;
}

export interface XAccountApiConfig {
  bearerToken: string;
  rateLimitRemaining: number;
  isConnected: boolean;
}

export interface XAccount {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  verified: boolean;
  category: string;
  followers: string;
  isSyncEnabled: boolean;
  isPrimary?: boolean; // Primary / Main account designation
  isRetracted: boolean; // Retracted/Collapsible box state on first page
  customOverrideText?: string;
  useAiAdaptation: boolean;
  staggerDelayMinutes: number;
  syncStatus: SyncStatus;
  lastSyncedAt?: string;
  nextScheduledAt?: string;
  stats: XAccountStats;
  apiConfig: XAccountApiConfig;
}

export interface ProxyConfig {
  enabled: boolean;
  type: 'socks5' | 'http' | 'mtproto';
  host: string;
  port: string;
  username?: string;
  password?: string;
  secret?: string; // For MTProto Telegram Proxy
  status?: 'untested' | 'connected' | 'failed';
}

export interface TelegramCredentials {
  phoneNumber: string;
  phoneCodeRequested: boolean;
  phoneCodeSent: boolean;
  phoneCodeInput?: string;
  twoFactorPassword?: string;
  isAuthenticatedWithPhone: boolean;
  authenticatedUserHandle?: string;
  apiId: string;
  apiHash: string;
  botToken: string;
  sessionString: string;
  isTelethonActive: boolean;
  isLocked: boolean;
  pinCode: string;
  requirePinForSecrets: boolean;
}

export type TelegramChannelType = 'source_feed' | 'managed_destination' | 'bot';

export interface TelegramChannel {
  id: string;
  title: string;
  username: string; // e.g. @TechPulseAlerts
  type: TelegramChannelType;
  subscribers: string;
  avatar?: string;
  isActive: boolean;
  isPrimary?: boolean; // Primary / Main Telegram Section designation
  autoForwardToX: boolean;
  autoReceiveFromX: boolean;
  keywordsFilter?: string;
  aiSummarizeBeforeSync?: boolean;
}

export interface TelegramMessage {
  id: string;
  channelId: string;
  channelTitle: string;
  senderName: string;
  text: string;
  timestamp: string;
  isIncoming: boolean;
  syncedToX?: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'gif' | 'audio' | 'document';
  mediaName?: string;
}

export interface BridgeRule {
  id: string;
  title: string;
  direction: 'x_to_telegram' | 'telegram_to_x' | 'bidirectional';
  sourceId: string; // 'x_primary' or telegram channel id
  targetId: string; // telegram channel id or 'x_all'
  isActive: boolean;
  aiAdaptation: boolean;
  autoApprove: boolean;
  filterKeywords: string;
}

export interface PostMedia {
  id: string;
  url: string;
  type: 'image' | 'video' | 'gif' | 'audio' | 'document';
  name: string;
  size?: string;
  duration?: string;
}

export interface PollData {
  question: string;
  options: string[];
}

export interface MasterPost {
  id: string;
  text: string;
  media: PostMedia[];
  poll?: PollData;
  createdAt: string;
  scheduledIntervalMinutes: number; // 0 = manual, 15, 30, 60, 120
  isAutoSendActive: boolean;
}

export interface SyncLogEntry {
  id: string;
  timestamp: string;
  accountId: string;
  accountName: string;
  accountHandle: string;
  textSent: string;
  status: 'success' | 'failed' | 'pending';
  tweetId?: string;
  latencyMs?: number;
  errorMessage?: string;
}

export interface AutoSyncState {
  isAutoPosting: boolean;
  intervalMinutes: number;
  secondsRemaining: number;
  staggerMode: 'simultaneous' | 'stagger_2m' | 'stagger_5m';
  autoRetryOnFailure: boolean;
  totalBroadcastsSent: number;
}

export interface McpToolConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface McpConfig {
  enabled: boolean;
  serverUrl: string;
  authToken?: string;
  status: 'connected' | 'disconnected' | 'testing';
  latencyMs?: number;
  availableTools: McpToolConfig[];
}

export interface AccountAiPersona {
  accountId: string; // matches X account.id or Telegram channel id
  accountHandle: string;
  accountName: string;
  customTone: string;
  rhetoricStyle: string;
  specificKeywords: string;
  bannedWords: string;
  customPromptInstruction: string;
  useCustomPersona: boolean;
}

export interface PlatformAiPrompt {
  xPrompt: string;
  telegramPrompt: string;
  xRhetoric: string;
  telegramRhetoric: string;
}

export interface AiEngineSettings {
  selectedModel: 'gemini-3.6-flash' | 'gemini-3.6-pro' | 'mcp-custom-agent' | 'gemini-2.5-flash';
  customApiKey?: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  
  // Scope Mode
  promptScopeMode: 'global' | 'platform_specific' | 'per_account';

  // Global Writing Instructions
  globalSystemInstruction: string;
  globalRhetoricStyle: string;
  globalTone: string;
  globalKeywords: string;
  globalBannedWords: string;
  emojiDensity: 'none' | 'minimal' | 'moderate' | 'heavy';
  includeHashtagStrategy: boolean;

  // Platform Specific Prompts
  platformPrompts: PlatformAiPrompt;

  // Per-Account Custom Personas
  accountPersonas: Record<string, AccountAiPersona>;

  // Model Context Protocol (MCP) Configuration
  mcp: McpConfig;
}

export interface AdvancedSettings {
  // Platform Local Password Protection
  platformLock: {
    enabled: boolean;
    isLocked: boolean;
    passwordPin: string;
  };

  // Dedicated X Proxy & Settings
  xProxy: ProxyConfig;
  xAutoThreadSplit: boolean;
  xRateLimitBufferMs: number;
  xCustomUserAgent: string;
  xMediaQuality: 'original' | 'compressed';
  xAutoHashtags: boolean;

  // Dedicated Telegram Proxy & Settings
  telegramProxy: ProxyConfig;
  telegramAutoRead: boolean;
  telegramMediaCompress: boolean;
  telegramMaxFileSizeMb: number;
  telegramAntiSpamDelaySec: number;
  telegramAutoTranslate: boolean;
  telegramTargetLanguage: string;
}

export interface RssFeedItem {
  id: string;
  feedId: string;
  title: string;
  link: string;
  pubDate: string;
  description: string;
  author?: string;
  category?: string;
  aiSummary?: string;
  isPublishedToX?: boolean;
  isPublishedToTelegram?: boolean;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'gif' | 'audio' | 'document';
  mediaName?: string;
}

export interface RssFeedSource {
  id: string;
  title: string;
  url: string;
  category: string;
  enabled: boolean;
  fetchIntervalMinutes: number;
  lastFetchedAt: string;
  status: 'active' | 'error' | 'syncing' | 'paused';
  errorMsg?: string;
  itemCount: number;
  autoAiSummarize: boolean;
  aiSummaryPrompt?: string;
  filterKeywords?: string; // Comma separated include keywords
  excludeKeywords?: string; // Comma separated exclude keywords
  targetXAccountIds: string[]; // Destination X pages/accounts
  targetTelegramChannelIds: string[]; // Destination Telegram pages/channels
  autoPublishToX: boolean;
  autoPublishToTelegram: boolean;
  prefixTag?: string; // e.g. "📰 [TechCrunch]"
  maxItemsPerFetch: number;
  items?: RssFeedItem[];
}

export interface RssFeedBroadcastLog {
  id: string;
  feedId: string;
  feedTitle: string;
  itemTitle: string;
  itemUrl: string;
  timestamp: string;
  destinations: {
    type: 'x' | 'telegram';
    id: string;
    name: string;
    handle: string;
    status: 'sent' | 'failed' | 'pending';
    messageId?: string;
  }[];
  aiSummaryUsed?: string;
}

