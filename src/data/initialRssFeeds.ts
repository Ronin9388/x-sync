import { RssFeedSource, RssFeedBroadcastLog } from '../types';

export const INITIAL_RSS_FEEDS: RssFeedSource[] = [
  {
    id: 'rss_1',
    title: 'TechCrunch AI & Startup News',
    url: 'https://techcrunch.com/category/artificial-intelligence/feed/',
    category: 'Technology & AI',
    enabled: true,
    fetchIntervalMinutes: 15,
    lastFetchedAt: 'Just now',
    status: 'active',
    itemCount: 12,
    autoAiSummarize: true,
    aiSummaryPrompt: 'Summarize into a punchy 2-sentence hook with 2 key bullet insights for tech enthusiasts.',
    filterKeywords: 'AI, LLM, OpenAI, startup, funding',
    excludeKeywords: 'lawsuit, layoff',
    targetXAccountIds: ['acc_1', 'acc_2'], // Configured X target pages
    targetTelegramChannelIds: ['tg_chan_1', 'tg_chan_2'], // Configured Telegram target pages
    autoPublishToX: true,
    autoPublishToTelegram: true,
    prefixTag: '⚡ [TechCrunch AI]',
    maxItemsPerFetch: 5,
    items: [
      {
        id: 'rss_item_101',
        feedId: 'rss_1',
        title: 'Anthropic releases new Claude models with enhanced reasoning and tool-use latency',
        link: 'https://techcrunch.com/2026/08/01/anthropic-releases-new-claude-models',
        pubDate: '10 mins ago',
        description: 'Anthropic has announced a major speed and reasoning update to its flagship Claude family, cutting tool execution latency by 40%.',
        category: 'AI',
        aiSummary: '🚀 Anthropic upgrades Claude models with 40% faster tool execution & deeper reasoning.\n• Greatly improves agentic coding workflows.\n• Rolls out across API and developer endpoints today.',
        isPublishedToX: true,
        isPublishedToTelegram: true,
      },
      {
        id: 'rss_item_102',
        feedId: 'rss_1',
        title: 'Open Source AI Startup raises $85M Series A for decentralized model training',
        link: 'https://techcrunch.com/2026/08/01/open-source-ai-startup-series-a',
        pubDate: '35 mins ago',
        description: 'A new startup building peer-to-peer distributed GPU cluster technology secures $85M to scale open-weight model training.',
        category: 'Startups',
        aiSummary: '💡 Open Source AI startup raises $85M to democratize GPU cluster training for developers.',
        isPublishedToX: true,
        isPublishedToTelegram: true,
      }
    ]
  },
  {
    id: 'rss_2',
    title: 'Hacker News Frontpage Feed',
    url: 'https://news.ycombinator.com/rss',
    category: 'Developer & Tech',
    enabled: true,
    fetchIntervalMinutes: 30,
    lastFetchedAt: '5 mins ago',
    status: 'active',
    itemCount: 25,
    autoAiSummarize: true,
    aiSummaryPrompt: 'Extract key technical breakthrough or engineering insight in 1 sentence.',
    filterKeywords: 'Show HN, Launch, Rust, Python, WebAssembly, Database',
    excludeKeywords: 'Ask HN',
    targetXAccountIds: ['acc_2'],
    targetTelegramChannelIds: ['tg_chan_1'],
    autoPublishToX: true,
    autoPublishToTelegram: true,
    prefixTag: '🔥 [Hacker News]',
    maxItemsPerFetch: 3,
    items: [
      {
        id: 'rss_item_201',
        feedId: 'rss_2',
        title: 'Show HN: LiteDB v6 – Zero-dependency embedded database for TypeScript & Edge',
        link: 'https://news.ycombinator.com/item?id=41002931',
        pubDate: '1 hour ago',
        description: 'An open-source ultra-fast document store written specifically for V8 and Cloudflare Workers runtime.',
        category: 'Show HN',
        aiSummary: '🛠️ Show HN: LiteDB v6 introduces zero-dependency embedded persistence for edge runtimes.',
        isPublishedToX: false,
        isPublishedToTelegram: true,
      }
    ]
  },
  {
    id: 'rss_3',
    title: 'CoinDesk Crypto & Web3 Headlines',
    url: 'https://www.coindesk.com/arc/outboundfeeds/rss/',
    category: 'Crypto & Markets',
    enabled: false,
    fetchIntervalMinutes: 60,
    lastFetchedAt: '1 hour ago',
    status: 'paused',
    itemCount: 18,
    autoAiSummarize: false,
    filterKeywords: 'Bitcoin, Ethereum, DeFi, Solana',
    excludeKeywords: 'meme',
    targetXAccountIds: ['acc_4'],
    targetTelegramChannelIds: ['tg_chan_3'],
    autoPublishToX: false,
    autoPublishToTelegram: true,
    prefixTag: '💎 [Crypto Feed]',
    maxItemsPerFetch: 3,
    items: []
  },
  {
    id: 'rss_4',
    title: 'The Verge Tech & Gadgets',
    url: 'https://www.theverge.com/rss/index.xml',
    category: 'Consumer Tech',
    enabled: true,
    fetchIntervalMinutes: 20,
    lastFetchedAt: '12 mins ago',
    status: 'active',
    itemCount: 15,
    autoAiSummarize: true,
    aiSummaryPrompt: 'Highlight consumer tech impact and launch details concisely.',
    filterKeywords: 'Google, Apple, Microsoft, Hardware, AI',
    excludeKeywords: '',
    targetXAccountIds: ['acc_1', 'acc_3'],
    targetTelegramChannelIds: ['tg_chan_2'],
    autoPublishToX: true,
    autoPublishToTelegram: true,
    prefixTag: '📱 [The Verge]',
    maxItemsPerFetch: 4,
    items: []
  }
];

export const INITIAL_RSS_BROADCAST_LOGS: RssFeedBroadcastLog[] = [
  {
    id: 'rss_log_1',
    feedId: 'rss_1',
    feedTitle: 'TechCrunch AI & Startup News',
    itemTitle: 'Anthropic releases new Claude models with enhanced reasoning and tool-use latency',
    itemUrl: 'https://techcrunch.com/2026/08/01/anthropic-releases-new-claude-models',
    timestamp: '10 mins ago',
    destinations: [
      { type: 'x', id: 'acc_1', name: 'Tech Pulse Official', handle: '@TechPulseApp', status: 'sent', messageId: 'tweet_9012' },
      { type: 'x', id: 'acc_2', name: 'Dev Insights Daily', handle: '@DevInsights', status: 'sent', messageId: 'tweet_9013' },
      { type: 'telegram', id: 'tg_chan_1', name: 'TechPulse Official Feed', handle: '@techpulse_official', status: 'sent', messageId: 'msg_882' },
      { type: 'telegram', id: 'tg_chan_2', name: 'Dev Flash Broadcasts', handle: '@dev_flash_news', status: 'sent', messageId: 'msg_883' },
    ],
    aiSummaryUsed: '🚀 Anthropic upgrades Claude models with 40% faster tool execution & deeper reasoning.\n• Greatly improves agentic coding workflows.\n• Rolls out across API and developer endpoints today.'
  },
  {
    id: 'rss_log_2',
    feedId: 'rss_2',
    feedTitle: 'Hacker News Frontpage Feed',
    itemTitle: 'Show HN: LiteDB v6 – Zero-dependency embedded database for TypeScript & Edge',
    itemUrl: 'https://news.ycombinator.com/item?id=41002931',
    timestamp: '1 hour ago',
    destinations: [
      { type: 'telegram', id: 'tg_chan_1', name: 'TechPulse Official Feed', handle: '@techpulse_official', status: 'sent', messageId: 'msg_879' },
    ],
    aiSummaryUsed: '🛠️ Show HN: LiteDB v6 introduces zero-dependency embedded persistence for edge runtimes.'
  }
];
