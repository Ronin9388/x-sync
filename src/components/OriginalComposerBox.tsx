import React, { useState, useRef } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  BarChart2, 
  Smile, 
  Clock, 
  Send, 
  Wand2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Flame, 
  FileText,
  Layers,
  HelpCircle,
  Video,
  Film,
  Volume2,
  Upload,
  PlayCircle,
  File
} from 'lucide-react';
import { MasterPost, PostMedia, PollData, AutoSyncState } from '../types';

interface OriginalComposerBoxProps {
  masterPost: MasterPost;
  onUpdateMasterText: (text: string) => void;
  onAddMedia: (media: PostMedia) => void;
  onRemoveMedia: (id: string) => void;
  onUpdatePoll: (poll: PollData | undefined) => void;
  onBroadcastNow: () => void;
  isSyncing: boolean;
  autoSyncState: AutoSyncState;
  onUpdateInterval: (minutes: number) => void;
  onGenerateAiVariations: () => void;
  isGeneratingAi: boolean;
  onEnhanceWithAi: (goal: string) => void;
}

export const OriginalComposerBox: React.FC<OriginalComposerBoxProps> = ({
  masterPost,
  onUpdateMasterText,
  onAddMedia,
  onRemoveMedia,
  onUpdatePoll,
  onBroadcastNow,
  isSyncing,
  autoSyncState,
  onUpdateInterval,
  onGenerateAiVariations,
  isGeneratingAi,
  onEnhanceWithAi,
}) => {
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState<'image' | 'video' | 'gif' | 'audio' | 'document'>('image');
  const [showPollBuilder, setShowPollBuilder] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charCount = masterPost.text.length;
  const maxChars = 280;
  const isOverLimit = charCount > maxChars;
  const charPercentage = Math.min(100, Math.round((charCount / maxChars) * 100));

  const handleAddMediaUrl = () => {
    if (!imageUrl.trim()) return;
    onAddMedia({
      id: `media_${Date.now()}`,
      url: imageUrl.trim(),
      type: selectedMediaType,
      name: `${selectedMediaType.toUpperCase()} Attachment`,
    });
    setImageUrl('');
    setShowMediaInput(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      let detectedType: 'image' | 'video' | 'gif' | 'audio' | 'document' = 'image';
      if (file.type.startsWith('video/')) detectedType = 'video';
      else if (file.type.startsWith('audio/')) detectedType = 'audio';
      else if (file.type === 'image/gif') detectedType = 'gif';
      else if (file.type.startsWith('image/')) detectedType = 'image';
      else detectedType = 'document';

      reader.onload = (event) => {
        if (event.target?.result) {
          onAddMedia({
            id: `media_upload_${Date.now()}_${i}`,
            url: event.target.result as string,
            type: detectedType,
            name: file.name,
            size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          });
        }
      };
      reader.readAsDataURL(file);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowMediaInput(false);
  };

  const handleAttachPreset = (type: 'image' | 'video' | 'gif' | 'audio') => {
    const presets: Record<'image' | 'video' | 'gif' | 'audio', { url: string; name: string; duration?: string }> = {
      image: {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        name: '4K Ultra HD Tech Visual.jpg',
      },
      video: {
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        name: 'Demo Launch Showcase 1080p.mp4',
        duration: '0:15',
      },
      gif: {
        url: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWVndmtlOHZqZHlyYTV2Z2g3eXkyeWRxZmlzeDNyZTBld3VrcXlhZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPnAiaMCws8nOsE/giphy.gif',
        name: 'AI Agent Loop.gif',
      },
      audio: {
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        name: 'Voice Note Podcast Update.mp3',
        duration: '1:20',
      },
    };

    const preset = presets[type];
    onAddMedia({
      id: `preset_${type}_${Date.now()}`,
      url: preset.url,
      type,
      name: preset.name,
      duration: preset.duration,
    });
    setShowMediaInput(false);
  };

  const handleSavePoll = () => {
    const validOptions = pollOptions.filter(o => o.trim().length > 0);
    if (pollQuestion.trim() && validOptions.length >= 2) {
      onUpdatePoll({
        question: pollQuestion.trim(),
        options: validOptions,
      });
      setShowPollBuilder(false);
    }
  };

  const handleRemovePoll = () => {
    onUpdatePoll(undefined);
    setShowPollBuilder(false);
  };

  return (
    <div className="bg-[#0F1419] border-2 border-[#1D9BF0]/50 rounded-2xl shadow-2xl p-5 md:p-6 text-white relative overflow-hidden transition-all hover:border-[#1D9BF0]">
      {/* Decorative top app tag */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1D9BF0] via-purple-500 to-[#1D9BF0]"></div>

      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#2F3336]">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-[#1D9BF0] text-white flex items-center justify-center font-black shadow-lg shadow-[#1D9BF0]/20">
            APP
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base md:text-lg font-bold text-white tracking-wide">
                Original Application Master Box
              </h2>
              <span className="px-2 py-0.5 text-[10px] uppercase tracking-wider font-extrabold bg-[#1D9BF0]/20 text-[#1D9BF0] border border-[#1D9BF0]/40 rounded-md">
                Primary Master
              </span>
            </div>
            <p className="text-xs text-[#71767B]">
              Compose message here. Broadcasts automatically to all 4 connected accounts below.
            </p>
          </div>
        </div>

        {/* Interval Settings Pill inside Box */}
        <div className="flex items-center space-x-2 bg-[#16181C] border border-[#2F3336] px-3 py-1.5 rounded-xl">
          <Clock className="w-3.5 h-3.5 text-[#1D9BF0]" />
          <span className="text-xs text-[#71767B] font-medium">Auto-Interval:</span>
          <select
            value={autoSyncState.intervalMinutes}
            onChange={(e) => onUpdateInterval(Number(e.target.value))}
            className="bg-black text-white text-xs font-semibold rounded-md border border-[#333639] px-2 py-0.5 focus:outline-none focus:border-[#1D9BF0]"
          >
            <option value={0}>Manual Only</option>
            <option value={1}>Every 1 min (Test)</option>
            <option value={5}>Every 5 mins</option>
            <option value={15}>Every 15 mins</option>
            <option value={30}>Every 30 mins</option>
            <option value={60}>Every 1 hour</option>
          </select>
        </div>
      </div>

      {/* Text Area Input */}
      <div className="relative mb-3">
        <textarea
          value={masterPost.text}
          onChange={(e) => onUpdateMasterText(e.target.value)}
          placeholder="What is happening? Type your master post here to sync across all connected X accounts..."
          rows={4}
          className={`w-full bg-black/80 text-white placeholder-[#71767B] text-base md:text-lg p-4 rounded-xl border transition-all resize-y focus:outline-none ${
            isOverLimit 
              ? 'border-red-500/80 focus:border-red-500' 
              : 'border-[#2F3336] focus:border-[#1D9BF0] focus:ring-1 focus:ring-[#1D9BF0]'
          }`}
        />

        {/* Character Limit Gauge */}
        <div className="absolute bottom-3 right-3 flex items-center space-x-2 bg-black/90 px-2.5 py-1 rounded-full border border-[#2F3336]">
          <div className="w-5 h-5 relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-[#2F3336]"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className={isOverLimit ? 'text-red-500' : charCount > 240 ? 'text-amber-400' : 'text-[#1D9BF0]'}
                strokeDasharray={`${charPercentage}, 100`}
                strokeWidth="3.5"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
          </div>
          <span className={`text-xs font-mono font-semibold ${isOverLimit ? 'text-red-400' : 'text-[#71767B]'}`}>
            {maxChars - charCount}
          </span>
        </div>
      </div>

      {/* Hidden Native File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="image/*,video/*,audio/*,.gif,.pdf"
        multiple
        className="hidden"
      />

      {/* Media & Poll Previews */}
      {masterPost.media.length > 0 && (
        <div className="mb-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {masterPost.media.map((item) => (
            <div key={item.id} className="relative rounded-xl overflow-hidden border border-[#2F3336] bg-black group p-1">
              {item.type === 'video' ? (
                <div className="space-y-1">
                  <video src={item.url} controls className="w-full h-40 object-cover rounded-lg bg-black" />
                  <div className="flex items-center justify-between px-2 py-1 text-[11px] font-mono text-[#71767B]">
                    <span className="flex items-center space-x-1 text-red-400 font-bold">
                      <Video className="w-3.5 h-3.5" />
                      <span>{item.name || 'HD Video.mp4'}</span>
                    </span>
                    {item.duration && <span>{item.duration}</span>}
                  </div>
                </div>
              ) : item.type === 'audio' ? (
                <div className="p-3 bg-[#16181C] rounded-lg border border-[#2F3336] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                      <Volume2 className="w-4 h-4" />
                      <span className="truncate max-w-[180px]">{item.name || 'Audio Track / Voice Note'}</span>
                    </span>
                    <span className="text-[10px] font-mono text-[#71767B]">AUDIO</span>
                  </div>
                  <audio src={item.url} controls className="w-full h-8" />
                </div>
              ) : item.type === 'gif' ? (
                <div className="relative">
                  <img src={item.url} alt="GIF Attachment" className="w-full h-40 object-cover rounded-lg" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-500/90 text-black shadow font-mono">
                    🎞️ ANIMATED GIF
                  </span>
                </div>
              ) : item.type === 'document' ? (
                <div className="p-3 bg-[#16181C] rounded-lg border border-[#2F3336] flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-xs font-bold text-white truncate max-w-[160px]">{item.name}</p>
                      <span className="text-[10px] text-[#71767B]">{item.size || 'DOCUMENT'}</span>
                    </div>
                  </div>
                  <a href={item.url} target="_blank" rel="noreferrer" className="text-xs text-[#1D9BF0] hover:underline font-bold">View</a>
                </div>
              ) : (
                <div className="relative">
                  <img src={item.url} alt="Photo Attachment" className="w-full h-40 object-cover rounded-lg" />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-black/80 text-white border border-[#2F3336]">
                    📸 Photo HD
                  </span>
                </div>
              )}

              <button
                onClick={() => onRemoveMedia(item.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 hover:bg-red-600 text-white transition-colors z-10 shadow-lg"
                title="Remove Media"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {masterPost.poll && (
        <div className="mb-3 p-3 rounded-xl bg-[#16181C] border border-[#2F3336] relative">
          <button
            onClick={handleRemovePoll}
            className="absolute top-2 right-2 text-[#71767B] hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center space-x-1.5 text-xs text-[#1D9BF0] font-semibold mb-2">
            <BarChart2 className="w-3.5 h-3.5" />
            <span>Poll Attached</span>
          </div>
          <p className="text-sm font-bold text-white mb-2">{masterPost.poll.question}</p>
          <div className="space-y-1.5">
            {masterPost.poll.options.map((opt, idx) => (
              <div key={idx} className="bg-black/60 border border-[#2F3336] px-3 py-1.5 rounded-lg text-xs text-[#E7E9EA]">
                Option {idx + 1}: {opt}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Expanded Multimedia Toolbar & Attach Popup */}
      {showMediaInput && (
        <div className="mb-3 p-4 rounded-2xl bg-[#16181C] border border-[#2F3336] space-y-3">
          <div className="flex items-center justify-between border-b border-[#2F3336] pb-2">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Film className="w-4 h-4 text-amber-400" />
              <span>Attach Multimedia (Photos, Videos, GIFs, Audio, Docs)</span>
            </span>
            <button onClick={() => setShowMediaInput(false)} className="text-[#71767B] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Device Upload vs Sample Presets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Option 1: Device File Upload */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="p-3 bg-black border-2 border-dashed border-[#2F3336] hover:border-[#1D9BF0] rounded-xl flex items-center justify-center space-x-2 cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4 text-[#1D9BF0]" />
              <span className="text-xs font-bold text-[#E7E9EA]">Upload Photo, Video, GIF, Audio from Device</span>
            </div>

            {/* Option 2: Sample Presets */}
            <div className="flex items-center justify-between gap-1 bg-black p-1.5 rounded-xl border border-[#2F3336]">
              <button
                onClick={() => handleAttachPreset('image')}
                className="flex-1 py-1.5 px-2 bg-[#16181C] hover:bg-[#202327] rounded-lg text-[11px] font-bold text-blue-400 flex items-center justify-center space-x-1"
                title="Attach Sample Photo"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>+ Photo</span>
              </button>

              <button
                onClick={() => handleAttachPreset('video')}
                className="flex-1 py-1.5 px-2 bg-[#16181C] hover:bg-[#202327] rounded-lg text-[11px] font-bold text-red-400 flex items-center justify-center space-x-1"
                title="Attach Sample 1080p MP4 Video"
              >
                <Video className="w-3.5 h-3.5" />
                <span>+ MP4</span>
              </button>

              <button
                onClick={() => handleAttachPreset('gif')}
                className="flex-1 py-1.5 px-2 bg-[#16181C] hover:bg-[#202327] rounded-lg text-[11px] font-bold text-amber-400 flex items-center justify-center space-x-1"
                title="Attach Sample Animated GIF"
              >
                <Film className="w-3.5 h-3.5" />
                <span>+ GIF</span>
              </button>

              <button
                onClick={() => handleAttachPreset('audio')}
                className="flex-1 py-1.5 px-2 bg-[#16181C] hover:bg-[#202327] rounded-lg text-[11px] font-bold text-emerald-400 flex items-center justify-center space-x-1"
                title="Attach Sample Voice Note / Audio"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>+ Audio</span>
              </button>
            </div>
          </div>

          {/* Option 3: URL Direct Input */}
          <div className="flex items-center space-x-2 pt-1">
            <select
              value={selectedMediaType}
              onChange={(e) => setSelectedMediaType(e.target.value as any)}
              className="bg-black text-white text-xs font-semibold rounded-xl border border-[#2F3336] px-2.5 py-2 focus:outline-none focus:border-[#1D9BF0]"
            >
              <option value="image">📸 Photo URL</option>
              <option value="video">🎥 Video (MP4/WebM) URL</option>
              <option value="gif">🎞️ Animated GIF URL</option>
              <option value="audio">🎵 Audio (MP3/Voice) URL</option>
              <option value="document">📄 Document (PDF) URL</option>
            </select>

            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste direct media URL..."
              className="flex-1 bg-black text-white text-xs p-2 rounded-xl border border-[#2F3336] focus:outline-none focus:border-[#1D9BF0]"
            />

            <button
              onClick={handleAddMediaUrl}
              className="px-4 py-2 bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white text-xs font-bold rounded-xl shadow"
            >
              Attach URL
            </button>
          </div>
        </div>
      )}

      {/* Poll Builder Popup Box */}
      {showPollBuilder && (
        <div className="mb-3 p-4 rounded-xl bg-[#16181C] border border-[#2F3336] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white uppercase tracking-wider">Poll Creation</span>
            <button onClick={() => setShowPollBuilder(false)} className="text-[#71767B] hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <input
            type="text"
            value={pollQuestion}
            onChange={(e) => setPollQuestion(e.target.value)}
            placeholder="Ask a question..."
            className="w-full bg-black text-white text-xs p-2.5 rounded-lg border border-[#333639] focus:outline-none focus:border-[#1D9BF0]"
          />
          <div className="space-y-2">
            {pollOptions.map((opt, i) => (
              <input
                key={i}
                type="text"
                value={opt}
                onChange={(e) => {
                  const updated = [...pollOptions];
                  updated[i] = e.target.value;
                  setPollOptions(updated);
                }}
                placeholder={`Option ${i + 1}`}
                className="w-full bg-black text-white text-xs p-2 rounded-lg border border-[#333639] focus:outline-none focus:border-[#1D9BF0]"
              />
            ))}
          </div>
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setPollOptions([...pollOptions, ''])}
              className="text-xs text-[#1D9BF0] hover:underline"
            >
              + Add Choice
            </button>
            <button
              type="button"
              onClick={handleSavePoll}
              className="px-3 py-1.5 bg-[#1D9BF0] text-white text-xs font-semibold rounded-lg"
            >
              Attach Poll
            </button>
          </div>
        </div>
      )}

      {/* Toolbar & AI Tools Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Attachment icons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setShowMediaInput(!showMediaInput)}
            className="p-2.5 rounded-full hover:bg-[#1D9BF0]/10 text-[#1D9BF0] transition-colors"
            title="Attach Media URL"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowPollBuilder(!showPollBuilder)}
            className="p-2.5 rounded-full hover:bg-[#1D9BF0]/10 text-[#1D9BF0] transition-colors"
            title="Create Poll"
          >
            <BarChart2 className="w-4 h-4" />
          </button>
          
          {/* Quick AI Enhancers */}
          <div className="h-4 w-[1px] bg-[#2F3336] mx-1"></div>

          <button
            onClick={() => onEnhanceWithAi('viral')}
            className="px-2.5 py-1 rounded-lg bg-[#16181C] hover:bg-[#202327] border border-[#2F3336] text-[11px] font-medium text-amber-300 flex items-center space-x-1"
            title="Make text viral & punchy with Gemini AI"
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span>Make Viral</span>
          </button>

          <button
            onClick={() => onEnhanceWithAi('concise')}
            className="px-2.5 py-1 rounded-lg bg-[#16181C] hover:bg-[#202327] border border-[#2F3336] text-[11px] font-medium text-[#E7E9EA] flex items-center space-x-1"
            title="Polish and shorten text"
          >
            <Wand2 className="w-3 h-3 text-[#1D9BF0]" />
            <span>Polish Text</span>
          </button>

          <button
            onClick={onGenerateAiVariations}
            disabled={isGeneratingAi}
            className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-[11px] font-semibold text-purple-300 flex items-center space-x-1"
            title="Generate account-tailored variants for all 4 boxes"
          >
            <Sparkles className={`w-3 h-3 text-purple-400 ${isGeneratingAi ? 'animate-spin' : ''}`} />
            <span>{isGeneratingAi ? 'Generating...' : 'AI 4-Box Variants'}</span>
          </button>
        </div>

        {/* Primary Broadcast Button */}
        <button
          onClick={onBroadcastNow}
          disabled={isSyncing || isOverLimit || !masterPost.text.trim()}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white text-sm font-bold shadow-lg shadow-[#1D9BF0]/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        >
          <Send className={`w-4 h-4 ${isSyncing ? 'animate-bounce' : ''}`} />
          <span>{isSyncing ? 'Syncing to 4 Accounts...' : 'Broadcast to 4 Accounts'}</span>
        </button>
      </div>
    </div>
  );
};
