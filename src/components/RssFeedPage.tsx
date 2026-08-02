import React, { useState } from 'react';
import { 
  Rss, 
  Plus, 
  Trash2, 
  Edit3, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  Bot, 
  Globe, 
  RefreshCw, 
  Wand2, 
  Filter, 
  Search, 
  ExternalLink, 
  Send, 
  Clock, 
  Settings2, 
  Layers, 
  ShieldCheck, 
  Check, 
  X, 
  ArrowRight,
  History,
  Tag,
  Sparkles,
  Zap,
  Sliders,
  Video,
  Volume2,
  Film,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { 
  RssFeedSource, 
  RssFeedItem, 
  RssFeedBroadcastLog, 
  XAccount, 
  TelegramChannel, 
  AiEngineSettings 
} from '../types';

interface RssFeedPageProps {
  rssFeeds: RssFeedSource[];
  broadcastLogs: RssFeedBroadcastLog[];
  xAccounts: XAccount[];
  telegramChannels: TelegramChannel[];
  aiSettings: AiEngineSettings;
  onUpdateRssFeeds: (updated: RssFeedSource[]) => void;
  onAddBroadcastLog: (log: RssFeedBroadcastLog) => void;
  addToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const RssFeedPage: React.FC<RssFeedPageProps> = ({
  rssFeeds,
  broadcastLogs,
  xAccounts,
  telegramChannels,
  aiSettings,
  onUpdateRssFeeds,
  onAddBroadcastLog,
  addToast,
}) => {
  const [activeTab, setActiveTab] = useState<'sources' | 'items_inspector' | 'broadcast_logs'>('sources');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [fetchingFeedId, setFetchingFeedId] = useState<string | null>(null);

  // Modal / Editing states
  const [editingFeed, setEditingFeed] = useState<RssFeedSource | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Feed Form State
  const [newFeed, setNewFeed] = useState<Partial<RssFeedSource>>({
    title: '',
    url: '',
    category: 'Technology',
    fetchIntervalMinutes: 15,
    enabled: true,
    autoAiSummarize: true,
    aiSummaryPrompt: 'Summarize into a punchy 2-sentence hook with key bullet insights.',
    filterKeywords: '',
    excludeKeywords: '',
    targetXAccountIds: xAccounts.slice(0, 2).map((a) => a.id),
    targetTelegramChannelIds: telegramChannels.slice(0, 2).map((c) => c.id),
    autoPublishToX: true,
    autoPublishToTelegram: true,
    prefixTag: '📰 [News]',
    maxItemsPerFetch: 5,
  });

  // Unique categories for filter dropdown
  const categories = Array.from(new Set(rssFeeds.map((f) => f.category))).filter(Boolean);

  // Filtered feeds list
  const filteredFeeds = rssFeeds.filter((feed) => {
    const matchesSearch = feed.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          feed.url.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || feed.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle Toggle Feed Enabled / Paused
  const handleToggleFeed = (feedId: string) => {
    const updated = rssFeeds.map((f) => {
      if (f.id === feedId) {
        const nextState = !f.enabled;
        return {
          ...f,
          enabled: nextState,
          status: nextState ? ('active' as const) : ('paused' as const),
        };
      }
      return f;
    });
    onUpdateRssFeeds(updated);
    addToast('info', 'RSS Feed Updated', 'Status changed.');
  };

  // Delete Feed Source
  const handleDeleteFeed = (feedId: string) => {
    if (confirm('Are you sure you want to remove this RSS Feed source?')) {
      const updated = rssFeeds.filter((f) => f.id !== feedId);
      onUpdateRssFeeds(updated);
      addToast('success', 'RSS Feed Removed');
    }
  };

  // Add New RSS Feed
  const handleCreateFeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeed.title || !newFeed.url) {
      addToast('error', 'Missing Information', 'Please provide both Feed Title and URL.');
      return;
    }

    const created: RssFeedSource = {
      id: `rss_${Date.now()}`,
      title: newFeed.title,
      url: newFeed.url,
      category: newFeed.category || 'General',
      enabled: newFeed.enabled ?? true,
      fetchIntervalMinutes: newFeed.fetchIntervalMinutes || 15,
      lastFetchedAt: 'Never',
      status: 'active',
      itemCount: 0,
      autoAiSummarize: newFeed.autoAiSummarize ?? true,
      aiSummaryPrompt: newFeed.aiSummaryPrompt || '',
      filterKeywords: newFeed.filterKeywords || '',
      excludeKeywords: newFeed.excludeKeywords || '',
      targetXAccountIds: newFeed.targetXAccountIds || [],
      targetTelegramChannelIds: newFeed.targetTelegramChannelIds || [],
      autoPublishToX: newFeed.autoPublishToX ?? true,
      autoPublishToTelegram: newFeed.autoPublishToTelegram ?? true,
      prefixTag: newFeed.prefixTag || '📰 [RSS]',
      maxItemsPerFetch: newFeed.maxItemsPerFetch || 5,
      items: [],
    };

    onUpdateRssFeeds([...rssFeeds, created]);
    setIsAddModalOpen(false);
    setNewFeed({
      title: '',
      url: '',
      category: 'Technology',
      fetchIntervalMinutes: 15,
      enabled: true,
      autoAiSummarize: true,
      aiSummaryPrompt: 'Summarize into a punchy 2-sentence hook with key bullet insights.',
      filterKeywords: '',
      excludeKeywords: '',
      targetXAccountIds: xAccounts.slice(0, 2).map((a) => a.id),
      targetTelegramChannelIds: telegramChannels.slice(0, 2).map((c) => c.id),
      autoPublishToX: true,
      autoPublishToTelegram: true,
      prefixTag: '📰 [News]',
      maxItemsPerFetch: 5,
    });
    addToast('success', 'RSS Source Added', `Added ${created.title} with target routing enabled.`);
  };

  // Save Edit Feed Form
  const handleSaveEditFeed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFeed) return;

    const updated = rssFeeds.map((f) => (f.id === editingFeed.id ? editingFeed : f));
    onUpdateRssFeeds(updated);
    setEditingFeed(null);
    addToast('success', 'RSS Feed Updated', `Saved settings for ${editingFeed.title}`);
  };

  // Fetch / Test Feed Immediately via Backend API
  const handleFetchFeedNow = async (feed: RssFeedSource) => {
    setFetchingFeedId(feed.id);
    try {
      const res = await fetch('/api/rss/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: feed.url,
          maxItems: feed.maxItemsPerFetch,
          filterKeywords: feed.filterKeywords,
          excludeKeywords: feed.excludeKeywords,
          autoAiSummarize: feed.autoAiSummarize,
          aiPrompt: feed.aiSummaryPrompt,
          aiSettings,
        }),
      });

      const data = await res.json();
      const fetchedItems: RssFeedItem[] = data.items || [];

      const updated = rssFeeds.map((f) => {
        if (f.id === feed.id) {
          return {
            ...f,
            lastFetchedAt: 'Just now',
            status: 'active' as const,
            itemCount: (f.itemCount || 0) + fetchedItems.length,
            items: [...fetchedItems, ...(f.items || [])].slice(0, 20),
          };
        }
        return f;
      });

      onUpdateRssFeeds(updated);
      addToast('success', 'RSS Feed Fetched!', `Fetched ${fetchedItems.length} items from ${feed.title}.`);

      // If auto-publish is enabled, broadcast directly to selected Telegram & X destinations
      if ((feed.autoPublishToX || feed.autoPublishToTelegram) && fetchedItems.length > 0) {
        await handleBroadcastRssItems(feed, fetchedItems);
      }
    } catch (err) {
      console.error(err);
      addToast('error', 'Fetch Failed', 'Unable to reach RSS endpoint. Please check feed URL.');
    } finally {
      setFetchingFeedId(null);
    }
  };

  // Global Sync All Feeds
  const handleSyncAllFeeds = async () => {
    setIsSyncingAll(true);
    for (const feed of rssFeeds.filter((f) => f.enabled)) {
      await handleFetchFeedNow(feed);
    }
    setIsSyncingAll(false);
    addToast('success', 'All Active RSS Feeds Synced!', 'Finished polling and routing all active RSS feeds.');
  };

  // Broadcast fetched items to target Telegram & X pages
  const handleBroadcastRssItems = async (feed: RssFeedSource, itemsToPublish: RssFeedItem[]) => {
    try {
      const targetXs = feed.autoPublishToX ? feed.targetXAccountIds : [];
      const targetTgs = feed.autoPublishToTelegram ? feed.targetTelegramChannelIds : [];

      const res = await fetch('/api/rss/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          feedId: feed.id,
          feedTitle: feed.title,
          items: itemsToPublish,
          targetXAccountIds: targetXs,
          targetTelegramChannelIds: targetTgs,
          prefixTag: feed.prefixTag,
          xAccounts,
          telegramChannels,
        }),
      });

      const data = await res.json();
      if (data.log) {
        onAddBroadcastLog(data.log);
        addToast(
          'success',
          'RSS Routed & Sent!',
          `Directly published feed content to ${data.log.destinations.length} target pages/channels.`
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Banner Header */}
      <div className="p-6 rounded-3xl bg-[#0F1419] border border-[#2F3336] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-500/10 via-[#1D9BF0]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl text-white shadow-lg">
              <Rss className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white tracking-tight">RSS Feed Routing & Source Manager</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> Auto Telegram & X Routing
                </span>
              </div>
              <p className="text-xs text-[#71767B] mt-0.5">
                Manage RSS sources, set up auto AI summaries, and directly route content to specified X accounts & Telegram pages.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={handleSyncAllFeeds}
              disabled={isSyncingAll}
              className="px-3.5 py-2 rounded-xl bg-[#16181C] hover:bg-[#202327] border border-[#2F3336] text-xs font-bold text-[#E7E9EA] flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-amber-400 ${isSyncingAll ? 'animate-spin' : ''}`} />
              <span>{isSyncingAll ? 'Syncing All...' : 'Sync All Feeds Now'}</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shadow-lg flex items-center space-x-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add RSS Source</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center justify-between gap-4 p-1.5 bg-[#0F1419] rounded-2xl border border-[#2F3336] overflow-x-auto">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'sources'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-[#71767B] hover:text-white bg-[#16181C]'
            }`}
          >
            <Rss className="w-4 h-4" />
            <span>📡 RSS Sources ({rssFeeds.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('items_inspector')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'items_inspector'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-[#71767B] hover:text-white bg-[#16181C]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-900" />
            <span>📰 Fetched Articles & AI Summaries</span>
          </button>

          <button
            onClick={() => setActiveTab('broadcast_logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
              activeTab === 'broadcast_logs'
                ? 'bg-amber-500 text-black shadow-md'
                : 'text-[#71767B] hover:text-white bg-[#16181C]'
            }`}
          >
            <History className="w-4 h-4" />
            <span>📋 Auto-Broadcast Logs ({broadcastLogs.length})</span>
          </button>
        </div>

        {/* Search & Category Filter */}
        {activeTab === 'sources' && (
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#71767B]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search RSS feeds..."
                className="bg-black border border-[#2F3336] rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#71767B] focus:outline-none focus:border-amber-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-black border border-[#2F3336] rounded-xl px-3 py-1.5 text-xs text-white"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: MANAGED RSS SOURCES */}
      {activeTab === 'sources' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFeeds.map((feed) => {
            const isFetching = fetchingFeedId === feed.id;

            return (
              <div
                key={feed.id}
                className={`p-6 rounded-3xl bg-[#0F1419] border transition-all space-y-5 shadow-xl ${
                  feed.enabled ? 'border-[#2F3336] hover:border-amber-500/40' : 'border-red-900/30 opacity-70'
                }`}
              >
                {/* Card Top Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400 mt-0.5">
                      <Rss className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-white">{feed.title}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#16181C] text-[#71767B] border border-[#2F3336]">
                          {feed.category}
                        </span>
                      </div>

                      <a
                        href={feed.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-[#1D9BF0] hover:underline flex items-center space-x-1 mt-0.5 font-mono"
                      >
                        <span className="truncate max-w-[280px]">{feed.url}</span>
                        <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleToggleFeed(feed.id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        feed.enabled
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {feed.enabled ? 'Active' : 'Paused'}
                    </button>

                    <button
                      onClick={() => setEditingFeed(feed)}
                      className="p-2 rounded-xl text-[#71767B] hover:text-white hover:bg-[#16181C] transition-colors"
                      title="Edit Feed Settings"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteFeed(feed.id)}
                      className="p-2 rounded-xl text-[#71767B] hover:text-red-400 hover:bg-[#16181C] transition-colors"
                      title="Remove Feed"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Direct Page Target Destinations Summary */}
                <div className="p-4 bg-[#16181C] rounded-2xl border border-[#2F3336] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#71767B]">
                      Direct Target Destinations
                    </span>
                    <span className="text-[11px] font-mono text-amber-400 font-bold">
                      Tag: {feed.prefixTag || 'None'}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Target X Accounts / Pages */}
                    <div className="p-3 bg-black rounded-xl border border-[#2F3336] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-[#1D9BF0]" /> X Pages ({feed.targetXAccountIds.length})
                        </span>
                        <span className={`text-[10px] font-bold ${feed.autoPublishToX ? 'text-emerald-400' : 'text-[#71767B]'}`}>
                          {feed.autoPublishToX ? 'Auto-Post' : 'Off'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {feed.targetXAccountIds.length > 0 ? (
                          feed.targetXAccountIds.map((accId) => {
                            const acc = xAccounts.find((a) => a.id === accId);
                            return (
                              <span key={accId} className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#1D9BF0]/10 text-[#1D9BF0] border border-[#1D9BF0]/20">
                                {acc?.handle || accId}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-[11px] text-[#71767B] italic">No X targets selected</span>
                        )}
                      </div>
                    </div>

                    {/* Target Telegram Channels / Pages */}
                    <div className="p-3 bg-black rounded-xl border border-[#2F3336] space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-white flex items-center gap-1">
                          <Bot className="w-3.5 h-3.5 text-[#0088cc]" /> Telegram Pages ({feed.targetTelegramChannelIds.length})
                        </span>
                        <span className={`text-[10px] font-bold ${feed.autoPublishToTelegram ? 'text-emerald-400' : 'text-[#71767B]'}`}>
                          {feed.autoPublishToTelegram ? 'Auto-Post' : 'Off'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {feed.targetTelegramChannelIds.length > 0 ? (
                          feed.targetTelegramChannelIds.map((chanId) => {
                            const chan = telegramChannels.find((c) => c.id === chanId);
                            return (
                              <span key={chanId} className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0088cc]/10 text-[#0088cc] border border-[#0088cc]/20">
                                {chan?.username || chanId}
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-[11px] text-[#71767B] italic">No Telegram targets selected</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI & Keyword Filtering Info */}
                <div className="flex flex-wrap items-center justify-between text-xs text-[#71767B] pt-1">
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>Every {feed.fetchIntervalMinutes} mins</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Wand2 className="w-3.5 h-3.5 text-purple-400" />
                      <span>{feed.autoAiSummarize ? 'AI Summary On' : 'Raw Text'}</span>
                    </span>
                  </div>

                  <span className="font-mono text-[11px]">
                    Last poll: <strong className="text-white">{feed.lastFetchedAt}</strong>
                  </span>
                </div>

                {/* Card Actions Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-[#2F3336]">
                  <div className="text-xs text-[#71767B]">
                    Fetched <strong className="text-white">{feed.itemCount || 0}</strong> total articles
                  </div>

                  <button
                    onClick={() => handleFetchFeedNow(feed)}
                    disabled={isFetching}
                    className="px-4 py-2 rounded-xl bg-[#16181C] hover:bg-[#202327] border border-[#2F3336] text-xs font-bold text-amber-400 flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
                    <span>{isFetching ? 'Fetching Feed...' : 'Poll & Route Content Now'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: ARTICLES INSPECTOR & MANUAL BROADCAST */}
      {activeTab === 'items_inspector' && (
        <div className="space-y-4">
          <div className="p-4 bg-[#0F1419] rounded-2xl border border-[#2F3336] flex items-center justify-between">
            <span className="text-xs text-[#71767B]">
              Inspect articles fetched across all active RSS feeds and manually trigger direct broadcasts.
            </span>
            <span className="text-xs font-bold text-amber-400 font-mono">
              Total Feed Articles: {rssFeeds.reduce((acc, f) => acc + (f.items?.length || 0), 0)}
            </span>
          </div>

          <div className="space-y-4">
            {rssFeeds.flatMap((f) => (f.items || []).map((item) => ({ ...item, feedTitle: f.title, feed: f }))).length > 0 ? (
              rssFeeds
                .flatMap((f) => (f.items || []).map((item) => ({ ...item, feedTitle: f.title, feed: f })))
                .map((article) => (
                  <div key={article.id} className="p-5 bg-[#0F1419] rounded-2xl border border-[#2F3336] space-y-3 hover:border-amber-500/30 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            {article.feedTitle}
                          </span>
                          <span className="text-xs text-[#71767B] font-mono">{article.pubDate}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1">
                          <a href={article.link} target="_blank" rel="noreferrer" className="hover:text-amber-400 hover:underline">
                            {article.title}
                          </a>
                        </h4>
                      </div>

                      <button
                        onClick={() => handleBroadcastRssItems(article.feed, [article])}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs flex items-center space-x-1.5 flex-shrink-0"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send to Telegram & X Pages</span>
                      </button>
                    </div>

                    <p className="text-xs text-[#E7E9EA] leading-relaxed bg-[#16181C] p-3 rounded-xl border border-[#2F3336]">
                      {article.description}
                    </p>

                    {/* RSS Item Enclosure / Attachment Rendering */}
                    {article.mediaUrl && (
                      <div className="rounded-xl overflow-hidden border border-[#2F3336] bg-black">
                        {article.mediaType === 'video' ? (
                          <div>
                            <video src={article.mediaUrl} controls className="w-full max-h-60 object-cover bg-black" />
                            <div className="p-2 text-[10px] font-bold text-red-400 bg-[#16181C] flex items-center justify-between">
                              <span className="flex items-center gap-1"><Video className="w-3.5 h-3.5" /> <span>{article.mediaName || 'RSS Video Enclosure'}</span></span>
                              <span>1080p MP4</span>
                            </div>
                          </div>
                        ) : article.mediaType === 'audio' ? (
                          <div className="p-3 bg-[#16181C] space-y-1">
                            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1"><Volume2 className="w-3.5 h-3.5" /> <span>{article.mediaName || 'Podcast Episode Enclosure'}</span></span>
                            <audio src={article.mediaUrl} controls className="w-full h-8" />
                          </div>
                        ) : article.mediaType === 'gif' ? (
                          <div className="relative">
                            <img src={article.mediaUrl} alt="GIF" className="w-full max-h-60 object-cover" />
                            <span className="absolute bottom-2 left-2 px-1.5 py-0.5 text-[9px] font-black uppercase bg-amber-500 text-black rounded font-mono">ANIMATED GIF</span>
                          </div>
                        ) : (
                          <img src={article.mediaUrl} alt="Article media" className="w-full max-h-60 object-cover" />
                        )}
                      </div>
                    )}

                    {article.aiSummary && (
                      <div className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl space-y-1">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> AI Generated Summary Hook
                        </span>
                        <p className="text-xs text-purple-200 font-sans whitespace-pre-line">
                          {article.aiSummary}
                        </p>
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <div className="p-12 text-center bg-[#0F1419] rounded-3xl border border-[#2F3336] space-y-3">
                <Rss className="w-8 h-8 text-[#71767B] mx-auto animate-pulse" />
                <p className="text-sm text-[#71767B]">No fetched articles yet. Click "Poll & Route Content Now" on any RSS source.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: BROADCAST LOGS */}
      {activeTab === 'broadcast_logs' && (
        <div className="space-y-4">
          {broadcastLogs.length > 0 ? (
            broadcastLogs.map((log) => (
              <div key={log.id} className="p-5 bg-[#0F1419] rounded-2xl border border-[#2F3336] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      {log.feedTitle}
                    </span>
                    <span className="text-xs text-[#71767B] font-mono">{log.timestamp}</span>
                  </div>
                  <span className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Delivered to {log.destinations.length} Pages</span>
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white">{log.itemTitle}</h4>

                <div className="flex flex-wrap gap-2 pt-1">
                  {log.destinations.map((dest, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono flex items-center space-x-1.5 border ${
                        dest.type === 'x'
                          ? 'bg-[#1D9BF0]/10 text-[#1D9BF0] border-[#1D9BF0]/20'
                          : 'bg-[#0088cc]/10 text-[#0088cc] border-[#0088cc]/20'
                      }`}
                    >
                      <span>{dest.type === 'x' ? '🐦' : '✈️'}</span>
                      <span>{dest.handle}</span>
                      <span className="text-[10px] text-emerald-400 font-bold">✓ Sent</span>
                    </span>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center bg-[#0F1419] rounded-3xl border border-[#2F3336] space-y-3">
              <History className="w-8 h-8 text-[#71767B] mx-auto" />
              <p className="text-sm text-[#71767B]">No auto-broadcast history yet. Direct RSS feed dispatches will appear here.</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: ADD NEW RSS SOURCE */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F1419] border border-[#2F3336] rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2F3336] pb-4">
              <div className="flex items-center space-x-2">
                <Rss className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Add New RSS Feed Source</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-[#71767B] hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFeed} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#E7E9EA] font-semibold mb-1">Feed Title / Publisher Name *</label>
                  <input
                    type="text"
                    required
                    value={newFeed.title}
                    onChange={(e) => setNewFeed({ ...newFeed, title: e.target.value })}
                    placeholder="e.g. Wired Tech & Science"
                    className="w-full bg-black border border-[#2F3336] rounded-xl px-3.5 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#E7E9EA] font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={newFeed.category}
                    onChange={(e) => setNewFeed({ ...newFeed, category: e.target.value })}
                    placeholder="e.g. AI & Robotics"
                    className="w-full bg-black border border-[#2F3336] rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#E7E9EA] font-semibold mb-1">RSS / Atom Feed URL *</label>
                <input
                  type="url"
                  required
                  value={newFeed.url}
                  onChange={(e) => setNewFeed({ ...newFeed, url: e.target.value })}
                  placeholder="https://example.com/feed.xml"
                  className="w-full bg-black border border-[#2F3336] rounded-xl px-3.5 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#E7E9EA] font-semibold mb-1">Fetch Interval (Mins)</label>
                  <select
                    value={newFeed.fetchIntervalMinutes}
                    onChange={(e) => setNewFeed({ ...newFeed, fetchIntervalMinutes: parseInt(e.target.value) })}
                    className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-white"
                  >
                    <option value={5}>Every 5 minutes</option>
                    <option value={15}>Every 15 minutes</option>
                    <option value={30}>Every 30 minutes</option>
                    <option value={60}>Every 1 hour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#E7E9EA] font-semibold mb-1">Prefix Hashtag / Tag</label>
                  <input
                    type="text"
                    value={newFeed.prefixTag}
                    onChange={(e) => setNewFeed({ ...newFeed, prefixTag: e.target.value })}
                    placeholder="e.g. 📰 [Wired]"
                    className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#E7E9EA] font-semibold mb-1">Max Items Per Fetch</label>
                  <input
                    type="number"
                    value={newFeed.maxItemsPerFetch}
                    onChange={(e) => setNewFeed({ ...newFeed, maxItemsPerFetch: parseInt(e.target.value) || 5 })}
                    className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Keyword Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#E7E9EA] font-semibold mb-1">Include Keywords (Comma separated)</label>
                  <input
                    type="text"
                    value={newFeed.filterKeywords}
                    onChange={(e) => setNewFeed({ ...newFeed, filterKeywords: e.target.value })}
                    placeholder="e.g. AI, LLM, OpenAI, Startup"
                    className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#E7E9EA] font-semibold mb-1">Exclude Keywords (Comma separated)</label>
                  <input
                    type="text"
                    value={newFeed.excludeKeywords}
                    onChange={(e) => setNewFeed({ ...newFeed, excludeKeywords: e.target.value })}
                    placeholder="e.g. lawsuit, layoff, rumor"
                    className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-white font-mono"
                  />
                </div>
              </div>

              {/* Direct Page Target Selection */}
              <div className="p-4 bg-[#16181C] rounded-2xl border border-[#2F3336] space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Direct Target Destination Pages</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Target X Pages */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#1D9BF0] flex items-center gap-1">
                        <Globe className="w-3.5 h-3.5" /> Target X Pages
                      </span>
                      <label className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newFeed.autoPublishToX}
                          onChange={(e) => setNewFeed({ ...newFeed, autoPublishToX: e.target.checked })}
                          className="rounded text-[#1D9BF0]"
                        />
                        <span className="text-[10px] text-white">Auto-Post</span>
                      </label>
                    </div>

                    <div className="space-y-1 max-h-28 overflow-y-auto p-2 bg-black rounded-xl border border-[#2F3336]">
                      {xAccounts.map((acc) => {
                        const isChecked = newFeed.targetXAccountIds?.includes(acc.id);
                        return (
                          <label key={acc.id} className="flex items-center justify-between p-1 hover:bg-[#16181C] rounded cursor-pointer">
                            <span className="text-[#E7E9EA] font-mono">{acc.handle} ({acc.name})</span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const current = newFeed.targetXAccountIds || [];
                                const next = e.target.checked ? [...current, acc.id] : current.filter((id) => id !== acc.id);
                                setNewFeed({ ...newFeed, targetXAccountIds: next });
                              }}
                              className="rounded text-[#1D9BF0]"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Select Target Telegram Pages */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#0088cc] flex items-center gap-1">
                        <Bot className="w-3.5 h-3.5" /> Target Telegram Pages
                      </span>
                      <label className="flex items-center space-x-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={newFeed.autoPublishToTelegram}
                          onChange={(e) => setNewFeed({ ...newFeed, autoPublishToTelegram: e.target.checked })}
                          className="rounded text-[#0088cc]"
                        />
                        <span className="text-[10px] text-white">Auto-Post</span>
                      </label>
                    </div>

                    <div className="space-y-1 max-h-28 overflow-y-auto p-2 bg-black rounded-xl border border-[#2F3336]">
                      {telegramChannels.map((chan) => {
                        const isChecked = newFeed.targetTelegramChannelIds?.includes(chan.id);
                        return (
                          <label key={chan.id} className="flex items-center justify-between p-1 hover:bg-[#16181C] rounded cursor-pointer">
                            <span className="text-[#E7E9EA] font-mono">{chan.username} ({chan.title})</span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const current = newFeed.targetTelegramChannelIds || [];
                                const next = e.target.checked ? [...current, chan.id] : current.filter((id) => id !== chan.id);
                                setNewFeed({ ...newFeed, targetTelegramChannelIds: next });
                              }}
                              className="rounded text-[#0088cc]"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#16181C] text-[#71767B] hover:text-white font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-lg"
                >
                  Save & Enable Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT RSS SOURCE */}
      {editingFeed && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0F1419] border border-[#2F3336] rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2F3336] pb-4">
              <div className="flex items-center space-x-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Edit RSS Feed: {editingFeed.title}</h3>
              </div>
              <button
                onClick={() => setEditingFeed(null)}
                className="p-1.5 text-[#71767B] hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditFeed} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#E7E9EA] font-semibold mb-1">Feed Title</label>
                  <input
                    type="text"
                    required
                    value={editingFeed.title}
                    onChange={(e) => setEditingFeed({ ...editingFeed, title: e.target.value })}
                    className="w-full bg-black border border-[#2F3336] rounded-xl px-3.5 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-[#E7E9EA] font-semibold mb-1">Category</label>
                  <input
                    type="text"
                    value={editingFeed.category}
                    onChange={(e) => setEditingFeed({ ...editingFeed, category: e.target.value })}
                    className="w-full bg-black border border-[#2F3336] rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#E7E9EA] font-semibold mb-1">RSS URL</label>
                <input
                  type="url"
                  required
                  value={editingFeed.url}
                  onChange={(e) => setEditingFeed({ ...editingFeed, url: e.target.value })}
                  className="w-full bg-black border border-[#2F3336] rounded-xl px-3.5 py-2 text-white font-mono"
                />
              </div>

              {/* Destination targets */}
              <div className="p-4 bg-[#16181C] rounded-2xl border border-[#2F3336] space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Target Page Destinations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* X targets */}
                  <div className="space-y-2">
                    <span className="font-bold text-[#1D9BF0] flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5" /> Target X Pages
                    </span>
                    <div className="space-y-1 max-h-28 overflow-y-auto p-2 bg-black rounded-xl border border-[#2F3336]">
                      {xAccounts.map((acc) => {
                        const isChecked = editingFeed.targetXAccountIds.includes(acc.id);
                        return (
                          <label key={acc.id} className="flex items-center justify-between p-1 hover:bg-[#16181C] rounded cursor-pointer">
                            <span className="text-[#E7E9EA] font-mono">{acc.handle} ({acc.name})</span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const current = editingFeed.targetXAccountIds || [];
                                const next = e.target.checked ? [...current, acc.id] : current.filter((id) => id !== acc.id);
                                setEditingFeed({ ...editingFeed, targetXAccountIds: next });
                              }}
                              className="rounded text-[#1D9BF0]"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Telegram targets */}
                  <div className="space-y-2">
                    <span className="font-bold text-[#0088cc] flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5" /> Target Telegram Pages
                    </span>
                    <div className="space-y-1 max-h-28 overflow-y-auto p-2 bg-black rounded-xl border border-[#2F3336]">
                      {telegramChannels.map((chan) => {
                        const isChecked = editingFeed.targetTelegramChannelIds.includes(chan.id);
                        return (
                          <label key={chan.id} className="flex items-center justify-between p-1 hover:bg-[#16181C] rounded cursor-pointer">
                            <span className="text-[#E7E9EA] font-mono">{chan.username} ({chan.title})</span>
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                const current = editingFeed.targetTelegramChannelIds || [];
                                const next = e.target.checked ? [...current, chan.id] : current.filter((id) => id !== chan.id);
                                setEditingFeed({ ...editingFeed, targetTelegramChannelIds: next });
                              }}
                              className="rounded text-[#0088cc]"
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingFeed(null)}
                  className="px-4 py-2 rounded-xl bg-[#16181C] text-[#71767B] hover:text-white font-bold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
