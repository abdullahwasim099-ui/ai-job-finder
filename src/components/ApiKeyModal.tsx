import React, { useState, useEffect } from 'react';
import { Key, X, Check, Trash2, Eye, EyeOff, Sparkles } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem('user_gemini_api_key') || localStorage.getItem('gemini_api_key') || '';
    setApiKey(key);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    localStorage.setItem('user_gemini_api_key', apiKey.trim());
    localStorage.setItem('gemini_api_key', apiKey.trim()); // Sync both for compatibility
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  const handleClear = () => {
    localStorage.removeItem('user_gemini_api_key');
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <Key className="w-4.5 h-4.5 text-zinc-400" />
            <span className="text-sm font-bold text-white uppercase tracking-wider">Configure Gemini API Key</span>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-zinc-400 leading-relaxed">
            By default, CareerPulse uses the server's configured environment API keys. If you want to use your own Google Gemini API key, input it below. It will be securely stored in your browser's local storage and passed directly.
          </p>

          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Your API Key</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-3 pr-10 py-2 bg-zinc-900 border border-zinc-800 rounded-xl text-xs sm:text-sm font-mono text-white focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-zinc-500 bg-zinc-900/30 border border-zinc-800/50 p-2.5 rounded-lg">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
              Recommended: <code>gemini-3.8-flash</code> or <code>gemini-3.5-flash</code>
            </span>
          </div>
        </div>

        <div className="px-5 py-3.5 bg-zinc-900/40 border-t border-zinc-800/60 flex items-center justify-end gap-2">
          {apiKey && (
            <button
              onClick={handleClear}
              className="px-3.5 py-1.5 text-xs font-semibold text-zinc-400 hover:text-rose-400 transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Key</span>
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-bold bg-white text-zinc-950 rounded-lg hover:bg-zinc-200 transition-all flex items-center gap-1.5"
          >
            {saved ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Saved!</span>
              </>
            ) : (
              <span>Save & Close</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
