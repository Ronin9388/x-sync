import React, { useState } from 'react';
import { Shield, Lock, Key, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface PlatformLockOverlayProps {
  isLocked: boolean;
  onUnlock: (passwordInput: string) => boolean;
  addToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const PlatformLockOverlay: React.FC<PlatformLockOverlayProps> = ({
  isLocked,
  onUnlock,
  addToast,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isLocked) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinInput.trim()) {
      setErrorMsg('Please enter your security password / PIN.');
      return;
    }

    const success = onUnlock(pinInput.trim());
    if (success) {
      setPinInput('');
      setErrorMsg('');
      addToast('success', 'Platform Unlocked', 'Full access restored to X Sync & Telegram Router.');
    } else {
      setErrorMsg('Incorrect Password / PIN. Default is 1234 or your custom password.');
      addToast('error', 'Authentication Failed', 'Invalid security password.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-[#0F1419] border border-[#2F3336] rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6 text-center relative overflow-hidden">
        
        {/* Glow accent behind icon */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-20 bg-[#1D9BF0]/10 blur-2xl rounded-full pointer-events-none"></div>

        {/* Lock Icon */}
        <div className="mx-auto w-16 h-16 rounded-3xl bg-[#1D9BF0]/15 border border-[#1D9BF0]/30 flex items-center justify-center text-[#1D9BF0] shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        {/* Header */}
        <div className="space-y-1.5">
          <h2 className="text-xl font-bold text-white tracking-tight">Platform Protected</h2>
          <p className="text-xs text-[#71767B]">
            This local X Sync & Telegram platform is password-protected. Enter your security PIN / Password to continue.
          </p>
        </div>

        {/* PIN Form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="relative">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="Enter Password / PIN (Default: 1234)"
                className="w-full bg-black border border-[#2F3336] rounded-2xl px-4 py-3 text-center text-white text-base font-mono tracking-widest focus:outline-none focus:border-[#1D9BF0] transition-colors"
                autoFocus
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 flex items-center justify-center space-x-1 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errorMsg}</span>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#1D9BF0] hover:bg-[#1A8CD8] text-white font-bold rounded-2xl text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
          >
            <span>Unlock Platform Access</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick hint */}
        <div className="pt-4 border-t border-[#2F3336]/60 text-[11px] text-[#71767B]">
          <p>🔒 Security active • Protection against unauthorized local broadcasts</p>
        </div>

      </div>
    </div>
  );
};
