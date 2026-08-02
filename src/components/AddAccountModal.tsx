import React, { useState } from 'react';
import { X, Plus, Shield, CheckCircle2 } from 'lucide-react';
import { XAccount } from '../types';

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (acc: Omit<XAccount, 'id'>) => void;
}

export const AddAccountModal: React.FC<AddAccountModalProps> = ({
  isOpen,
  onClose,
  onAddAccount,
}) => {
  const [name, setName] = useState('');
  const [handle, setHandle] = useState('');
  const [category, setCategory] = useState('Tech & Code');
  const [avatar, setAvatar] = useState('');
  const [bearerToken, setBearerToken] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !handle.trim()) return;

    const formattedHandle = handle.startsWith('@') ? handle.trim() : `@${handle.trim()}`;
    const defaultAvatar = avatar.trim() || `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`;

    onAddAccount({
      name: name.trim(),
      handle: formattedHandle,
      avatar: defaultAvatar,
      verified: true,
      category: category.trim(),
      followers: '10.5K',
      isSyncEnabled: true,
      isRetracted: true,
      useAiAdaptation: false,
      staggerDelayMinutes: 0,
      syncStatus: 'idle',
      stats: {
        postsToday: 0,
        totalSynced: 0,
        avgImpressions: '5.2K',
      },
      apiConfig: {
        bearerToken: bearerToken.trim() || `x_oauth2_${Date.now()}`,
        rateLimitRemaining: 100,
        isConnected: true,
      },
    });

    setName('');
    setHandle('');
    setAvatar('');
    setBearerToken('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#0F1419] border border-[#2F3336] rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#2F3336]">
          <div className="flex items-center space-x-2">
            <Plus className="w-5 h-5 text-[#1D9BF0]" />
            <h3 className="text-lg font-bold">Connect New X Account</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-[#71767B] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#71767B] uppercase mb-1">Account Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Web3 Trends Daily"
              className="w-full bg-black text-white p-2.5 rounded-xl border border-[#333639] focus:outline-none focus:border-[#1D9BF0] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#71767B] uppercase mb-1">X Handle</label>
            <input
              type="text"
              required
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="e.g. @Web3Trends_X"
              className="w-full bg-black text-white p-2.5 rounded-xl border border-[#333639] focus:outline-none focus:border-[#1D9BF0] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#71767B] uppercase mb-1">Category / Vibe</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Crypto & DeFi News"
              className="w-full bg-black text-white p-2.5 rounded-xl border border-[#333639] focus:outline-none focus:border-[#1D9BF0] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#71767B] uppercase mb-1">Avatar Image URL (Optional)</label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="w-full bg-black text-white p-2.5 rounded-xl border border-[#333639] focus:outline-none focus:border-[#1D9BF0] text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#71767B] uppercase mb-1">X API Bearer Token (Optional)</label>
            <input
              type="password"
              value={bearerToken}
              onChange={(e) => setBearerToken(e.target.value)}
              placeholder="AAAAAAAAAAAAAAAAAAAAA..."
              className="w-full bg-black text-white p-2.5 rounded-xl border border-[#333639] focus:outline-none focus:border-[#1D9BF0] text-sm font-mono"
            />
          </div>

          <div className="pt-3 flex items-center justify-end space-x-2 border-t border-[#2F3336]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white rounded-xl text-xs font-bold"
            >
              Add Connected Box
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
