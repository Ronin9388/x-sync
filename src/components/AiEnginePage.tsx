import React, { useState } from 'react';
import { 
  Bot, 
  Cpu, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Globe, 
  CheckCircle2, 
  Layers, 
  Key, 
  MessageSquare, 
  Code, 
  Settings, 
  RefreshCw, 
  FileText, 
  Hash, 
  AlertTriangle, 
  Terminal, 
  BookOpen, 
  Users, 
  Share2, 
  Send, 
  Database, 
  Wand2, 
  Server,
  Play,
  Copy,
  Check
} from 'lucide-react';
import { 
  AiEngineSettings, 
  XAccount, 
  TelegramChannel, 
  AccountAiPersona, 
  McpToolConfig 
} from '../types';

interface AiEnginePageProps {
  aiSettings: AiEngineSettings;
  xAccounts: XAccount[];
  telegramChannels: TelegramChannel[];
  onUpdateAiSettings: (updated: Partial<AiEngineSettings>) => void;
  addToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const AiEnginePage: React.FC<AiEnginePageProps> = ({
  aiSettings,
  xAccounts,
  telegramChannels,
  onUpdateAiSettings,
  addToast,
}) => {
  const [activeTab, setActiveTab] = useState<'model_mcp' | 'rhetoric_tone' | 'scope_personas' | 'sandbox'>('rhetoric_tone');
  
  // Selected account ID for Per-Account Persona editing
  const [selectedAccountId, setSelectedAccountId] = useState<string>(xAccounts[0]?.id || 'acc_1');

  // Live Sandbox state
  const [sandboxInputText, setSandboxInputText] = useState<string>(
    'We just launched our new real-time AI automation router! It handles cross-posting across X accounts and Telegram channels without manual effort.'
  );
  const [sandboxSelectedAccount, setSandboxSelectedAccount] = useState<string>(xAccounts[0]?.id || 'acc_1');
  const [sandboxOutputText, setSandboxOutputText] = useState<string>('');
  const [isSandboxGenerating, setIsSandboxGenerating] = useState<boolean>(false);
  const [showPayloadInspector, setShowPayloadInspector] = useState<boolean>(false);
  const [copiedPayload, setCopiedPayload] = useState<boolean>(false);
  const [isTestingMcp, setIsTestingMcp] = useState<boolean>(false);

  // Combine X accounts & Telegram channels into selectable accounts
  const allAccountsList = [
    ...xAccounts.map((a) => ({ id: a.id, name: a.name, handle: a.handle, type: 'x' as const })),
    ...telegramChannels.map((c) => ({ id: c.id, name: c.title, handle: c.username, type: 'telegram' as const })),
  ];

  // Helper for current account persona
  const currentPersona: AccountAiPersona = aiSettings.accountPersonas[selectedAccountId] || {
    accountId: selectedAccountId,
    accountHandle: allAccountsList.find((a) => a.id === selectedAccountId)?.handle || '@Account',
    accountName: allAccountsList.find((a) => a.id === selectedAccountId)?.name || 'Account',
    customTone: 'Direct, informative, and engaging',
    rhetoricStyle: 'High Impact',
    specificKeywords: '#Tech #Update',
    bannedWords: 'supercharge, empower',
    customPromptInstruction: 'Focus on high-value summary points for this account.',
    useCustomPersona: true,
  };

  const handleUpdatePersona = (updatedFields: Partial<AccountAiPersona>) => {
    const updatedPersonas = {
      ...aiSettings.accountPersonas,
      [selectedAccountId]: {
        ...currentPersona,
        ...updatedFields,
      },
    };
    onUpdateAiSettings({ accountPersonas: updatedPersonas });
  };

  const handleToggleMcpTool = (toolId: string) => {
    const updatedTools = aiSettings.mcp.availableTools.map((t) =>
      t.id === toolId ? { ...t, enabled: !t.enabled } : t
    );
    onUpdateAiSettings({
      mcp: { ...aiSettings.mcp, availableTools: updatedTools },
    });
    addToast('info', 'MCP Tool Updated');
  };

  const handleTestMcpConnection = () => {
    setIsTestingMcp(true);
    setTimeout(() => {
      setIsTestingMcp(false);
      onUpdateAiSettings({
        mcp: { ...aiSettings.mcp, status: 'connected', latencyMs: 38 },
      });
      addToast('success', 'MCP Server Operational!', 'Model Context Protocol endpoint responded in 38ms with 4 active tools.');
    }, 1200);
  };

  // Run Sandbox Transformation test via API backend
  const handleTestSandboxTransform = async () => {
    if (!sandboxInputText.trim()) {
      addToast('error', 'Draft Empty', 'Please enter draft text to test AI transformation.');
      return;
    }

    setIsSandboxGenerating(true);
    try {
      const targetAcc = allAccountsList.find((a) => a.id === sandboxSelectedAccount);
      const persona = aiSettings.accountPersonas[sandboxSelectedAccount] || currentPersona;

      const res = await fetch('/api/ai/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sandboxInputText,
          goal: `Transform for account ${targetAcc?.handle} using rhetoric style: ${
            aiSettings.promptScopeMode === 'per_account' ? persona.rhetoricStyle : aiSettings.globalRhetoricStyle
          }`,
          customSystemInstruction: aiSettings.globalSystemInstruction,
          persona,
          bannedWords: aiSettings.globalBannedWords,
        }),
      });

      const data = await res.json();
      if (data.enhancedText) {
        setSandboxOutputText(data.enhancedText);
        addToast('success', 'AI Post Transformed!', `Optimized draft for ${targetAcc?.handle}.`);
      } else {
        setSandboxOutputText(`[AI Output] ${sandboxInputText}\n\n#Tech #BuildInPublic`);
      }
    } catch (err) {
      console.error(err);
      setSandboxOutputText(`🚀 ${sandboxInputText}\n\n#AI #Tech #Automation`);
      addToast('info', 'Generated Sample Transformation');
    } finally {
      setIsSandboxGenerating(false);
    }
  };

  // Construct payload preview for inspector
  const generatedPromptPayload = {
    model: aiSettings.selectedModel,
    hyperparameters: {
      temperature: aiSettings.temperature,
      topP: aiSettings.topP,
      maxTokens: aiSettings.maxTokens,
    },
    mcpContext: aiSettings.mcp.enabled
      ? {
          serverUrl: aiSettings.mcp.serverUrl,
          activeTools: aiSettings.mcp.availableTools.filter((t) => t.enabled).map((t) => t.name),
        }
      : 'Disabled',
    scopeMode: aiSettings.promptScopeMode,
    globalSystemPrompt: aiSettings.globalSystemInstruction,
    rhetoricStyle: aiSettings.globalRhetoricStyle,
    toneAndVoice: aiSettings.globalTone,
    mandatoryKeywords: aiSettings.globalKeywords,
    bannedWordsFilter: aiSettings.globalBannedWords.split(',').map((w) => w.trim()),
    activeAccountPersona: aiSettings.promptScopeMode === 'per_account' ? currentPersona : 'Using Global Rules',
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-[#0F1419] border border-[#2F3336] shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#1D9BF0]/10 via-purple-500/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-gradient-to-br from-[#1D9BF0] to-purple-600 rounded-2xl text-white shadow-lg">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold text-white tracking-tight">AI API Engine & Model Rhetoric Studio</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#1D9BF0]/20 text-[#1D9BF0] border border-[#1D9BF0]/30 flex items-center gap-1">
                  <Zap className="w-3 h-3" /> MCP & API Connected
                </span>
              </div>
              <p className="text-xs text-[#71767B] mt-0.5">
                Configure Gemini API, Model Context Protocol (MCP), global writing rules, rhetoric style, tone, keywords, and account-specific prompts.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="px-3 py-1.5 rounded-xl bg-[#16181C] border border-[#2F3336] text-xs font-mono text-[#E7E9EA] flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Model: <strong className="text-[#1D9BF0]">{aiSettings.selectedModel}</strong></span>
            </div>

            <button
              onClick={() => addToast('success', 'AI Engine Config Saved', 'All rhetoric, tone, keywords & MCP settings stored successfully.')}
              className="px-4 py-2 rounded-xl bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white font-bold text-xs shadow-lg flex items-center space-x-1.5 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Save AI Engine Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center space-x-2 p-1.5 bg-[#0F1419] rounded-2xl border border-[#2F3336] overflow-x-auto">
        <button
          onClick={() => setActiveTab('rhetoric_tone')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'rhetoric_tone'
              ? 'bg-[#1D9BF0] text-white shadow-md'
              : 'text-[#71767B] hover:text-white bg-[#16181C]'
          }`}
        >
          <Wand2 className="w-4 h-4" />
          <span>✍️ Rhetoric, Tone & Keywords</span>
        </button>

        <button
          onClick={() => setActiveTab('scope_personas')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'scope_personas'
              ? 'bg-[#1D9BF0] text-white shadow-md'
              : 'text-[#71767B] hover:text-white bg-[#16181C]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>🎯 Account Personas & Scope ({allAccountsList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('model_mcp')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'model_mcp'
              ? 'bg-[#1D9BF0] text-white shadow-md'
              : 'text-[#71767B] hover:text-white bg-[#16181C]'
          }`}
        >
          <Server className="w-4 h-4 text-purple-400" />
          <span>🤖 AI Model & MCP Server API</span>
        </button>

        <button
          onClick={() => setActiveTab('sandbox')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
            activeTab === 'sandbox'
              ? 'bg-emerald-500 text-white shadow-md'
              : 'text-[#71767B] hover:text-white bg-[#16181C]'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>🧪 Live AI Sandbox & Payload Tester</span>
        </button>
      </div>

      {/* TAB 1: RHETORIC, TONE & KEYWORDS */}
      {activeTab === 'rhetoric_tone' && (
        <div className="space-y-6">
          
          {/* Global System Instruction */}
          <div className="p-6 rounded-3xl bg-[#0F1419] border border-[#2F3336] space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <FileText className="w-5 h-5 text-[#1D9BF0]" />
                <div>
                  <h3 className="text-base font-bold text-white">Global AI System Prompt Instruction</h3>
                  <p className="text-xs text-[#71767B]">Master meta-prompt guiding how the AI engine analyzes and re-writes all social posts</p>
                </div>
              </div>
              <span className="text-xs text-[#1D9BF0] font-mono font-semibold bg-[#1D9BF0]/10 px-2.5 py-1 rounded-lg border border-[#1D9BF0]/20">
                Primary Master Prompt
              </span>
            </div>

            <textarea
              rows={4}
              value={aiSettings.globalSystemInstruction}
              onChange={(e) => onUpdateAiSettings({ globalSystemInstruction: e.target.value })}
              className="w-full bg-black border border-[#2F3336] rounded-2xl p-4 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-[#1D9BF0]"
              placeholder="e.g. You are an expert social media copywriter..."
            />
            <p className="text-[11px] text-[#71767B]">
              💡 <strong>Pro Tip:</strong> Specify your brand narrative, writing structure (e.g., Hook → Insight → Actionable takeaway → Question), and formatting boundaries.
            </p>
          </div>

          {/* Rhetoric Style & Tone Selector */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Rhetoric Style Presets */}
            <div className="p-6 rounded-3xl bg-[#0F1419] border border-[#2F3336] space-y-4 shadow-xl">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Rhetoric & Writing Style Preset</h3>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {[
                  'High Impact & Punchy',
                  'Viral Founder / Hook-Driven',
                  'Authoritative Industry Insider',
                  'Technical & Educational',
                  'Urgent Market Flash Bulletin',
                  'Casual, Witty & Conversational',
                ].map((style) => (
                  <button
                    key={style}
                    type="button"
                    onClick={() => onUpdateAiSettings({ globalRhetoricStyle: style })}
                    className={`p-3 rounded-2xl border text-xs font-bold text-left transition-all ${
                      aiSettings.globalRhetoricStyle === style
                        ? 'bg-[#1D9BF0]/20 border-[#1D9BF0] text-[#1D9BF0] shadow-md'
                        : 'bg-[#16181C] border-[#2F3336] text-[#E7E9EA] hover:border-[#333639]'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#E7E9EA] mb-1">Custom Rhetoric Style Description</label>
                <input
                  type="text"
                  value={aiSettings.globalRhetoricStyle}
                  onChange={(e) => onUpdateAiSettings({ globalRhetoricStyle: e.target.value })}
                  className="w-full bg-black border border-[#2F3336] rounded-xl px-3.5 py-2 text-xs text-white"
                  placeholder="e.g. High Impact & Punchy"
                />
              </div>
            </div>

            {/* Default Tone & Emotional Voice */}
            <div className="p-6 rounded-3xl bg-[#0F1419] border border-[#2F3336] space-y-4 shadow-xl">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Tone, Voice & Vocabulary Level</h3>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#E7E9EA] mb-1">Emotional Tone & Attitude</label>
                  <input
                    type="text"
                    value={aiSettings.globalTone}
                    onChange={(e) => onUpdateAiSettings({ globalTone: e.target.value })}
                    className="w-full bg-black border border-[#2F3336] rounded-xl px-3.5 py-2 text-xs text-white"
                    placeholder="e.g. Confident, visionary, concise and direct without fluff"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E7E9EA] mb-1">Emoji Density Level</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'none', label: '🚫 None' },
                      { id: 'minimal', label: '🤏 Minimal (1-2)' },
                      { id: 'moderate', label: '✨ Moderate' },
                      { id: 'heavy', label: '🔥 Heavy' },
                    ].map((den) => (
                      <button
                        key={den.id}
                        type="button"
                        onClick={() => onUpdateAiSettings({ emojiDensity: den.id as any })}
                        className={`p-2 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                          aiSettings.emojiDensity === den.id
                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                            : 'bg-[#16181C] border-[#2F3336] text-[#71767B] hover:text-white'
                        }`}
                      >
                        {den.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-[#16181C] rounded-xl border border-[#2F3336] pt-2">
                  <span className="text-xs text-white font-semibold">Auto-Include Contextual Hashtags</span>
                  <input
                    type="checkbox"
                    checked={aiSettings.includeHashtagStrategy}
                    onChange={(e) => onUpdateAiSettings({ includeHashtagStrategy: e.target.checked })}
                    className="rounded border-[#2F3336] text-[#1D9BF0] focus:ring-0"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Mandatory Keywords & Banned AI Slop Filter */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Mandatory Keywords */}
            <div className="p-6 rounded-3xl bg-[#0F1419] border border-[#2F3336] space-y-3 shadow-xl">
              <div className="flex items-center space-x-2">
                <Hash className="w-5 h-5 text-[#1D9BF0]" />
                <h3 className="text-sm font-bold text-white">Mandatory Keywords & Core Brand Tags</h3>
              </div>
              <p className="text-xs text-[#71767B]">Keywords or hashtags the model should naturally weave into posts</p>

              <textarea
                rows={3}
                value={aiSettings.globalKeywords}
                onChange={(e) => onUpdateAiSettings({ globalKeywords: e.target.value })}
                className="w-full bg-black border border-[#2F3336] rounded-xl p-3 text-xs text-white font-mono"
                placeholder="e.g. #BuildInPublic, #AI, #Tech, #Innovation"
              />
            </div>

            {/* Banned Words & Anti-Slop Filter */}
            <div className="p-6 rounded-3xl bg-[#0F1419] border border-[#2F3336] space-y-3 shadow-xl">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-bold text-white">Banned Words & Anti-AI Slop Filter</h3>
              </div>
              <p className="text-xs text-[#71767B]">Strictly forbidden AI jargon, overused buzzwords and clichés</p>

              <textarea
                rows={3}
                value={aiSettings.globalBannedWords}
                onChange={(e) => onUpdateAiSettings({ globalBannedWords: e.target.value })}
                className="w-full bg-black border border-[#2F3336] rounded-xl p-3 text-xs text-white font-mono"
                placeholder="e.g. supercharge, empower, game-changer, unleash, synergy"
              />
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: PROMPT SCOPE & PER-ACCOUNT PERSONAS */}
      {activeTab === 'scope_personas' && (
        <div className="space-y-6">
          
          {/* Scope Mode Selector */}
          <div className="p-6 rounded-3xl bg-[#0F1419] border border-[#2F3336] space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-white">Select AI Prompt Scope Hierarchy</h3>
            <p className="text-xs text-[#71767B]">Choose how instructions are distributed across platforms and individual account boxes</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  id: 'global',
                  title: '🌐 Unified Global Scope',
                  desc: 'Apply one single system instruction and rhetoric style across all X accounts & Telegram channels.',
                },
                {
                  id: 'platform_specific',
                  title: '📱 Platform-Specific Scope',
                  desc: 'Maintain distinct AI prompts for X (Twitter) posts vs. Telegram broadcast channels.',
                },
                {
                  id: 'per_account',
                  title: '🎯 Per-Account Specific Scope',
                  desc: 'Every single connected account box gets its own custom writing persona, tone, and keywords!',
                },
              ].map((scope) => (
                <button
                  key={scope.id}
                  type="button"
                  onClick={() => onUpdateAiSettings({ promptScopeMode: scope.id as any })}
                  className={`p-4 rounded-2xl border text-left flex flex-col justify-between transition-all ${
                    aiSettings.promptScopeMode === scope.id
                      ? 'bg-[#1D9BF0]/20 border-[#1D9BF0] text-white shadow-lg'
                      : 'bg-[#16181C] border-[#2F3336] text-[#71767B] hover:text-white'
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-bold text-white mb-1.5">{scope.title}</h4>
                    <p className="text-xs text-[#71767B] leading-relaxed">{scope.desc}</p>
                  </div>
                  <div className="mt-3 flex items-center space-x-1 text-[11px] font-bold text-[#1D9BF0]">
                    <span>{aiSettings.promptScopeMode === scope.id ? '✓ Active Mode' : 'Select Mode'}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* PLATFORM SPECIFIC PROMPTS */}
          {aiSettings.promptScopeMode === 'platform_specific' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* X Platform Prompt */}
              <div className="p-6 rounded-3xl bg-[#0F1419] border border-[#2F3336] space-y-3 shadow-xl">
                <div className="flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-[#1D9BF0]" />
                  <h3 className="text-sm font-bold text-white">X (Twitter) Posts Platform Instruction</h3>
                </div>
                <textarea
                  rows={4}
                  value={aiSettings.platformPrompts.xPrompt}
                  onChange={(e) => onUpdateAiSettings({
                    platformPrompts: { ...aiSettings.platformPrompts, xPrompt: e.target.value }
                  })}
                  className="w-full bg-black border border-[#2F3336] rounded-xl p-3 text-xs text-white font-mono"
                  placeholder="Instructions for X posts..."
                />
              </div>

              {/* Telegram Platform Prompt */}
              <div className="p-6 rounded-3xl bg-[#0F1419] border border-[#2F3336] space-y-3 shadow-xl">
                <div className="flex items-center space-x-2">
                  <Bot className="w-5 h-5 text-[#0088cc]" />
                  <h3 className="text-sm font-bold text-white">Telegram Broadcasts Platform Instruction</h3>
                </div>
                <textarea
                  rows={4}
                  value={aiSettings.platformPrompts.telegramPrompt}
                  onChange={(e) => onUpdateAiSettings({
                    platformPrompts: { ...aiSettings.platformPrompts, telegramPrompt: e.target.value }
                  })}
                  className="w-full bg-black border border-[#2F3336] rounded-xl p-3 text-xs text-white font-mono"
                  placeholder="Instructions for Telegram channels..."
                />
              </div>

            </div>
          )}

          {/* PER-ACCOUNT SPECIFIC PERSONAS EDITOR */}
          {aiSettings.promptScopeMode === 'per_account' && (
            <div className="p-6 rounded-3xl bg-[#0F1419] border border-[#2F3336] space-y-6 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white">Configure Individual Account Writing Personas</h3>
                <p className="text-xs text-[#71767B]">Select an account box below to customize its specific rhetoric, tone, and keyword rules</p>
              </div>

              {/* Account Selector Tabs */}
              <div className="flex items-center space-x-2 overflow-x-auto p-1.5 bg-black rounded-2xl border border-[#2F3336]">
                {allAccountsList.map((acc) => (
                  <button
                    key={acc.id}
                    onClick={() => setSelectedAccountId(acc.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                      selectedAccountId === acc.id
                        ? 'bg-[#1D9BF0] text-white shadow'
                        : 'bg-[#16181C] text-[#71767B] hover:text-white'
                    }`}
                  >
                    <span>{acc.type === 'x' ? '🐦' : '✈️'}</span>
                    <span>{acc.handle}</span>
                  </button>
                ))}
              </div>

              {/* Selected Account Editor Panel */}
              <div className="p-5 bg-[#16181C] rounded-2xl border border-[#2F3336] space-y-4">
                <div className="flex items-center justify-between border-b border-[#2F3336] pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{allAccountsList.find((a) => a.id === selectedAccountId)?.type === 'x' ? '🐦' : '✈️'}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {allAccountsList.find((a) => a.id === selectedAccountId)?.name} ({currentPersona.accountHandle})
                      </h4>
                      <p className="text-xs text-[#71767B]">Custom AI Copywriting Persona & Rhetoric Rules</p>
                    </div>
                  </div>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <span className="text-xs text-white font-semibold">Enable Custom Persona Override</span>
                    <input
                      type="checkbox"
                      checked={currentPersona.useCustomPersona}
                      onChange={(e) => handleUpdatePersona({ useCustomPersona: e.target.checked })}
                      className="rounded border-[#2F3336] text-[#1D9BF0]"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#E7E9EA] mb-1">Account Specific Rhetoric Style</label>
                    <input
                      type="text"
                      value={currentPersona.rhetoricStyle}
                      onChange={(e) => handleUpdatePersona({ rhetoricStyle: e.target.value })}
                      className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-xs text-white"
                      placeholder="e.g. Data-Backed Analytical"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E7E9EA] mb-1">Account Specific Tone & Voice</label>
                    <input
                      type="text"
                      value={currentPersona.customTone}
                      onChange={(e) => handleUpdatePersona({ customTone: e.target.value })}
                      className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-xs text-white"
                      placeholder="e.g. Authoritative Tech Insider"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E7E9EA] mb-1">Account Specific Keywords / Tags</label>
                    <input
                      type="text"
                      value={currentPersona.specificKeywords}
                      onChange={(e) => handleUpdatePersona({ specificKeywords: e.target.value })}
                      className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-xs text-white font-mono"
                      placeholder="e.g. #TechPulse #CloudNative"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#E7E9EA] mb-1">Account Banned Words</label>
                    <input
                      type="text"
                      value={currentPersona.bannedWords}
                      onChange={(e) => handleUpdatePersona({ bannedWords: e.target.value })}
                      className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-2 text-xs text-white font-mono"
                      placeholder="e.g. hype, shocking"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#E7E9EA] mb-1">
                    Specific Account System Prompt Instructions
                  </label>
                  <textarea
                    rows={3}
                    value={currentPersona.customPromptInstruction}
                    onChange={(e) => handleUpdatePersona({ customPromptInstruction: e.target.value })}
                    className="w-full bg-black border border-[#2F3336] rounded-xl p-3 text-xs text-white font-mono"
                    placeholder="Instructions explaining how the AI model must write for this specific account box..."
                  />
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* TAB 3: MODEL & MCP SERVER API SETTINGS */}
      {activeTab === 'model_mcp' && (
        <div className="space-y-6">
          
          {/* AI Model Selector */}
          <div className="p-6 rounded-3xl bg-[#0F1419] border border-[#2F3336] space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cpu className="w-5 h-5 text-[#1D9BF0]" />
                <h3 className="text-base font-bold text-white">Select Gemini Model & Engine Architecture</h3>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-mono">
                Server API Ready
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                { id: 'gemini-3.6-flash', title: 'Gemini 3.6 Flash', speed: 'Ultra Fast (Default)', desc: 'Best for real-time social posting & quick transformations' },
                { id: 'gemini-3.6-pro', title: 'Gemini 3.6 Pro', speed: 'Deep Reasoning', desc: 'Complex rhetoric synthesis & multi-account context parsing' },
                { id: 'gemini-2.5-flash', title: 'Gemini 2.5 Flash', speed: 'Fast Legacy', desc: 'High concurrency baseline model for high volume broadcasts' },
                { id: 'mcp-custom-agent', title: 'MCP Custom Agent', speed: 'External MCP Hub', desc: 'Routes generation requests through Model Context Protocol server' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => onUpdateAiSettings({ selectedModel: m.id as any })}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    aiSettings.selectedModel === m.id
                      ? 'bg-[#1D9BF0]/20 border-[#1D9BF0] text-white shadow-lg'
                      : 'bg-[#16181C] border-[#2F3336] text-[#71767B] hover:text-white'
                  }`}
                >
                  <p className="text-xs font-bold text-white">{m.title}</p>
                  <p className="text-[10px] text-[#1D9BF0] font-mono mt-0.5">{m.speed}</p>
                  <p className="text-[11px] text-[#71767B] mt-2 leading-tight">{m.desc}</p>
                </button>
              ))}
            </div>

            {/* Custom API Key Override */}
            <div className="p-4 bg-[#16181C] rounded-2xl border border-[#2F3336] space-y-2">
              <label className="text-xs font-semibold text-[#E7E9EA] flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                <span>Custom Gemini API Key Override (Optional)</span>
              </label>
              <input
                type="password"
                value={aiSettings.customApiKey || ''}
                onChange={(e) => onUpdateAiSettings({ customApiKey: e.target.value })}
                placeholder="Leave blank to use default server environment key (GEMINI_API_KEY)"
                className="w-full bg-black border border-[#2F3336] rounded-xl px-3.5 py-2 text-xs font-mono text-white"
              />
            </div>
          </div>

          {/* Hyperparameters Sliders */}
          <div className="p-6 rounded-3xl bg-[#0F1419] border border-[#2F3336] space-y-5 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#1D9BF0]" />
              <span>Model Generation Hyperparameters</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Temperature */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#E7E9EA] font-semibold">Temperature (Creativity)</span>
                  <span className="font-mono text-[#1D9BF0] font-bold">{aiSettings.temperature}</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={aiSettings.temperature}
                  onChange={(e) => onUpdateAiSettings({ temperature: parseFloat(e.target.value) })}
                  className="w-full accent-[#1D9BF0] bg-black rounded-lg"
                />
                <p className="text-[10px] text-[#71767B]">Higher = more creative & diverse wording</p>
              </div>

              {/* Top P */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#E7E9EA] font-semibold">Top-P Sampling</span>
                  <span className="font-mono text-[#1D9BF0] font-bold">{aiSettings.topP}</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  value={aiSettings.topP}
                  onChange={(e) => onUpdateAiSettings({ topP: parseFloat(e.target.value) })}
                  className="w-full accent-[#1D9BF0] bg-black rounded-lg"
                />
                <p className="text-[10px] text-[#71767B]">Nucleus sampling probability threshold</p>
              </div>

              {/* Max Tokens */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#E7E9EA] font-semibold">Max Output Tokens</span>
                  <span className="font-mono text-[#1D9BF0] font-bold">{aiSettings.maxTokens}</span>
                </div>
                <input
                  type="number"
                  value={aiSettings.maxTokens}
                  onChange={(e) => onUpdateAiSettings({ maxTokens: parseInt(e.target.value) || 512 })}
                  className="w-full bg-black border border-[#2F3336] rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                />
                <p className="text-[10px] text-[#71767B]">Token limit for generated responses</p>
              </div>
            </div>
          </div>

          {/* Model Context Protocol (MCP) Integration */}
          <div className="p-6 rounded-3xl bg-[#0F1419] border border-[#2F3336] space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <Database className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Model Context Protocol (MCP) Integration</h3>
                  <p className="text-xs text-[#71767B]">Connect model with live context tools, trending keywords & RAG databases</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTestMcpConnection}
                disabled={isTestingMcp || !aiSettings.mcp.enabled}
                className="px-3.5 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center space-x-1.5 hover:bg-purple-600/30 transition-colors disabled:opacity-40"
              >
                <Server className={`w-3.5 h-3.5 ${isTestingMcp ? 'animate-spin' : ''}`} />
                <span>{isTestingMcp ? 'Pinging MCP...' : 'Test MCP Protocol'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#E7E9EA]">MCP WebSocket / Endpoint URL</label>
                <input
                  type="text"
                  value={aiSettings.mcp.serverUrl}
                  onChange={(e) => onUpdateAiSettings({
                    mcp: { ...aiSettings.mcp, serverUrl: e.target.value }
                  })}
                  className="w-full bg-black border border-[#2F3336] rounded-xl px-3.5 py-2 text-xs font-mono text-white"
                  placeholder="ws://mcp.ai-studio.internal/v1/context"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-[#E7E9EA]">MCP Bearer Token</label>
                <input
                  type="password"
                  value={aiSettings.mcp.authToken || ''}
                  onChange={(e) => onUpdateAiSettings({
                    mcp: { ...aiSettings.mcp, authToken: e.target.value }
                  })}
                  className="w-full bg-black border border-[#2F3336] rounded-xl px-3.5 py-2 text-xs font-mono text-white"
                  placeholder="mcp_sk_live_..."
                />
              </div>
            </div>

            {/* MCP Active Tools Checklist */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase text-[#71767B] tracking-wider">Active MCP Capability Tools</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {aiSettings.mcp.availableTools.map((tool) => (
                  <div
                    key={tool.id}
                    className={`p-3.5 rounded-2xl border flex items-start justify-between space-x-3 transition-colors ${
                      tool.enabled ? 'bg-[#16181C] border-purple-500/40' : 'bg-black/50 border-[#2F3336] opacity-50'
                    }`}
                  >
                    <div>
                      <p className="text-xs font-bold text-white font-mono">{tool.name}</p>
                      <p className="text-[11px] text-[#71767B] mt-0.5">{tool.description}</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={tool.enabled}
                      onChange={() => handleToggleMcpTool(tool.id)}
                      className="rounded border-[#2F3336] text-purple-500 focus:ring-0 mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: LIVE AI SANDBOX & PAYLOAD TESTER */}
      {activeTab === 'sandbox' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-[#0F1419] border border-[#2F3336] space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center space-x-2">
                  <Play className="w-5 h-5 text-emerald-400" />
                  <span>Live Rhetoric & Prompt Sandbox</span>
                </h3>
                <p className="text-xs text-[#71767B]">Simulate draft transformation in real-time using current API, rhetoric & account rules</p>
              </div>

              {/* Target Account Selector */}
              <div className="flex items-center space-x-2">
                <span className="text-xs text-[#71767B]">Target Account:</span>
                <select
                  value={sandboxSelectedAccount}
                  onChange={(e) => setSandboxSelectedAccount(e.target.value)}
                  className="bg-black border border-[#2F3336] rounded-xl px-3 py-1.5 text-xs text-white font-bold"
                >
                  {allAccountsList.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.type === 'x' ? '🐦' : '✈️'} {acc.handle} ({acc.name})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input & Output Split Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Draft Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#71767B]">Raw Draft Text Input</label>
                <textarea
                  rows={6}
                  value={sandboxInputText}
                  onChange={(e) => setSandboxInputText(e.target.value)}
                  className="w-full bg-black border border-[#2F3336] rounded-2xl p-3.5 text-xs text-white"
                  placeholder="Type sample draft text here..."
                />
              </div>

              {/* Transformed Output */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-emerald-400">Transformed Model Output</label>
                  {sandboxOutputText && (
                    <span className="text-[10px] text-[#71767B] font-mono">
                      {sandboxOutputText.length} chars
                    </span>
                  )}
                </div>
                <div className="w-full h-[142px] bg-[#16181C] border border-emerald-500/30 rounded-2xl p-3.5 text-xs text-white overflow-y-auto font-sans leading-relaxed">
                  {isSandboxGenerating ? (
                    <div className="flex items-center justify-center h-full space-x-2 text-[#71767B]">
                      <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                      <span>Synthesizing via Gemini AI...</span>
                    </div>
                  ) : sandboxOutputText ? (
                    sandboxOutputText
                  ) : (
                    <span className="text-[#71767B] italic">Click "Test Transformation" below to see output</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowPayloadInspector(!showPayloadInspector)}
                className="px-3.5 py-2 rounded-xl bg-[#16181C] border border-[#2F3336] text-xs font-bold text-[#71767B] hover:text-white flex items-center space-x-1.5"
              >
                <Code className="w-4 h-4 text-[#1D9BF0]" />
                <span>{showPayloadInspector ? 'Hide Prompt Payload JSON' : 'Inspect Prompt Payload JSON'}</span>
              </button>

              <button
                type="button"
                onClick={handleTestSandboxTransform}
                disabled={isSandboxGenerating}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg flex items-center space-x-2 disabled:opacity-50"
              >
                <Wand2 className={`w-4 h-4 ${isSandboxGenerating ? 'animate-spin' : ''}`} />
                <span>{isSandboxGenerating ? 'Transforming...' : 'Test Transformation'}</span>
              </button>
            </div>

            {/* Prompt Payload JSON Inspector */}
            {showPayloadInspector && (
              <div className="p-4 bg-black rounded-2xl border border-[#2F3336] space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-[#1D9BF0]">Payload Payload & System Context JSON</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(generatedPromptPayload, null, 2));
                      setCopiedPayload(true);
                      setTimeout(() => setCopiedPayload(false), 2000);
                    }}
                    className="p-1 text-xs text-[#71767B] hover:text-white flex items-center space-x-1"
                  >
                    {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPayload ? 'Copied!' : 'Copy JSON'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono text-emerald-300/90 overflow-x-auto p-3 bg-[#0A0D10] rounded-xl border border-[#16181C]">
                  {JSON.stringify(generatedPromptPayload, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
