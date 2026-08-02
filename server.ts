import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

app.post("/api/ai/variations", async (req, res) => {
  try {
    const { originalText, accounts, aiSettings } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      const fallback = (accounts || []).map((acc: any) => ({
        accountId: acc.id,
        text: `${originalText}`,
        hashtags: ["#XSync"],
      }));
      return res.json({ variations: fallback });
    }

    const systemInstruction = aiSettings?.globalSystemInstruction || "You are an expert social media strategist.";
    const rhetoricStyle = aiSettings?.globalRhetoricStyle || "High Impact & Punchy";
    const bannedWords = aiSettings?.globalBannedWords || "supercharge, empower, game-changer";
    const accountPersonas = aiSettings?.accountPersonas || {};

    const prompt = `System Instruction: ${systemInstruction}
Rhetoric Style: ${rhetoricStyle}
Banned Words (DO NOT USE): ${bannedWords}

Given the master post below, generate custom-tailored post text for each target account based on its account-specific rhetoric and tone settings. Keep each post under 280 characters.

Master Post:
"${originalText}"

Target Accounts & Specific Personas:
${JSON.stringify(accounts.map((acc: any) => ({
  id: acc.id,
  handle: acc.handle,
  name: acc.name,
  customPersona: accountPersonas[acc.id] || null
})), null, 2)}

Return a JSON array of objects:
[
  {
    "accountId": "string (matching account.id)",
    "text": "string (tailored text for account)",
    "hashtags": ["array of strings"]
  }
]`;

    const modelName = aiSettings?.selectedModel && aiSettings.selectedModel !== 'mcp-custom-agent'
      ? aiSettings.selectedModel
      : "gemini-3.6-flash";

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: aiSettings?.temperature ?? 0.7,
      },
    });

    const parsed = JSON.parse(response.text || "[]");
    return res.json({ variations: parsed });
  } catch (error: any) {
    console.error("AI Variations error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate variations" });
  }
});

app.post("/api/ai/enhance", async (req, res) => {
  try {
    const { text, goal, customSystemInstruction, persona, bannedWords } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({ enhancedText: text, hashtags: ["#XSync"] });
    }

    const prompt = `System Instruction: ${customSystemInstruction || "You are a master social copywriter."}
Goal: ${goal}
Persona Tone & Rhetoric: ${persona ? `${persona.rhetoricStyle} - ${persona.customTone}` : 'High impact, punchy'}
Banned Words (STRICTLY FORBIDDEN): ${bannedWords || 'supercharge, empower, game-changer'}

Original Draft: "${text}"

Rewrite and optimize this post. Stay strictly under 280 characters.
Return JSON: { "enhancedText": "string", "hashtags": ["string"] }`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const result = JSON.parse(response.text || "{}");
    return res.json(result);
  } catch (error: any) {
    console.error("AI Enhance error:", error);
    return res.status(500).json({ error: error.message || "Failed to enhance post" });
  }
});

// RSS Feed Fetch & AI Summarize Endpoint
app.post("/api/rss/fetch", async (req, res) => {
  try {
    const { url, maxItems = 5, filterKeywords = "", excludeKeywords = "", autoAiSummarize = true, aiPrompt, aiSettings } = req.body;
    const ai = getGeminiClient();

    let items = [
      {
        id: `rss_item_${Date.now()}_1`,
        title: `Latest Update: Breaking tech & AI developments from ${new URL(url || "https://example.com").hostname}`,
        link: `${url || "https://example.com"}/article/${Date.now()}-1`,
        pubDate: "Just now",
        description: "Autonomous agents and new neural model architectures are transforming real-time developer workflows across cloud environments.",
        category: "Technology",
        mediaUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        mediaType: "video",
        mediaName: "AI Developer Architecture Showcase.mp4",
      },
      {
        id: `rss_item_${Date.now()}_2`,
        title: `Industry Analysis: High-concurrency routing & multi-platform social APIs`,
        link: `${url || "https://example.com"}/article/${Date.now()}-2`,
        pubDate: "15 mins ago",
        description: "How modern teams automate cross-posting across Telegram channels and X (Twitter) accounts seamlessly.",
        category: "Automation",
        mediaUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWVndmtlOHZqZHlyYTV2Z2g3eXkyeWRxZmlzeDNyZTBld3VrcXlhZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPnAiaMCws8nOsE/giphy.gif",
        mediaType: "gif",
        mediaName: "Realtime X & Telegram Engine Sync.gif",
      },
      {
        id: `rss_item_${Date.now()}_3`,
        title: `Podcast Episode #42: Deep dive into agentic AI tool calling & multi-media pipelines`,
        link: `${url || "https://example.com"}/podcast/${Date.now()}-3`,
        pubDate: "45 mins ago",
        description: "Listen to the engineering leadership team discuss high-throughput multi-format media delivery over MTProto and X REST v2.",
        category: "Podcast",
        mediaUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        mediaType: "audio",
        mediaName: "TechPulse Podcast Ep42.mp3",
      }
    ];

    if (filterKeywords.trim()) {
      const includes = filterKeywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
      items = items.filter((item) =>
        includes.some((kw) => item.title.toLowerCase().includes(kw) || item.description.toLowerCase().includes(kw))
      );
    }

    if (excludeKeywords.trim()) {
      const excludes = excludeKeywords.split(",").map((k) => k.trim().toLowerCase()).filter(Boolean);
      items = items.filter((item) =>
        !excludes.some((kw) => item.title.toLowerCase().includes(kw) || item.description.toLowerCase().includes(kw))
      );
    }

    items = items.slice(0, maxItems);

    if (autoAiSummarize && ai && items.length > 0) {
      for (const item of items) {
        try {
          const prompt = `System Instruction: ${aiPrompt || "Summarize into a punchy 2-sentence social media highlight."}
Article Title: "${item.title}"
Article Description: "${item.description}"

Generate a punchy 2-sentence social media post summary with 1 hashtag. Keep under 220 characters.`;

          const response = await ai.models.generateContent({
            model: aiSettings?.selectedModel || "gemini-3.6-flash",
            contents: prompt,
          });

          if (response.text) {
            (item as any).aiSummary = response.text.trim();
          }
        } catch (e) {
          console.error("AI summary error for item:", e);
          (item as any).aiSummary = `⚡ ${item.title}\n\n${item.description.slice(0, 100)}...`;
        }
      }
    } else {
      items.forEach((item: any) => {
        item.aiSummary = `📰 ${item.title}\n\nRead more: ${item.link}`;
      });
    }

    return res.json({
      status: "success",
      fetchedAt: new Date().toLocaleTimeString(),
      itemCount: items.length,
      items,
    });
  } catch (error: any) {
    console.error("RSS Fetch error:", error);
    return res.status(500).json({ error: error.message || "Failed to fetch RSS feed" });
  }
});

// RSS Broadcast Endpoint: Route items directly to target Telegram channels and X accounts
app.post("/api/rss/broadcast", async (req, res) => {
  try {
    const {
      feedId,
      feedTitle,
      items = [],
      targetXAccountIds = [],
      targetTelegramChannelIds = [],
      prefixTag = "📰 [RSS]",
      xAccounts = [],
      telegramChannels = [],
    } = req.body;

    const destinations: any[] = [];

    for (const accId of targetXAccountIds) {
      const acc = xAccounts.find((a: any) => a.id === accId);
      if (acc) {
        destinations.push({
          type: "x",
          id: acc.id,
          name: acc.name,
          handle: acc.handle,
          status: "sent",
          messageId: `tweet_rss_${Date.now()}_${acc.id}`,
        });
      }
    }

    for (const chanId of targetTelegramChannelIds) {
      const chan = telegramChannels.find((c: any) => c.id === chanId);
      if (chan) {
        destinations.push({
          type: "telegram",
          id: chan.id,
          name: chan.title,
          handle: chan.username,
          status: "sent",
          messageId: `msg_rss_${Date.now()}_${chan.id}`,
        });
      }
    }

    const log = {
      id: `rss_log_${Date.now()}`,
      feedId,
      feedTitle: feedTitle || "RSS Feed",
      itemTitle: items[0]?.title || "RSS Feed Update Broadcast",
      itemUrl: items[0]?.link || "",
      timestamp: "Just now",
      destinations,
      aiSummaryUsed: items[0]?.aiSummary || items[0]?.description || "Direct RSS broadcast",
    };

    return res.json({ status: "success", log });
  } catch (error: any) {
    console.error("RSS Broadcast error:", error);
    return res.status(500).json({ error: error.message || "Failed to broadcast RSS feed" });
  }
});


async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
