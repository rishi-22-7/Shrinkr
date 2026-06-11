import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function ResultCard({ result }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <div className="w-full mt-6 glass-panel p-6 rounded-3xl animate-fade-in border-[#2C221E]/20 shadow-[0_15px_40px_rgba(44,34,30,0.05)] flex flex-col gap-4">
      {/* Success Checkmark & Header */}
      <div className="flex items-center gap-4">
        <div className="checkmark">
          <svg className="w-[56px] h-[56px]" viewBox="0 0 52 52">
            <circle className="checkmark-circle" cx="26" cy="26" r="25" />
            <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-900 leading-none mb-1">
            URL Shrunk Successfully!
          </h3>
          <p className="text-xs text-[#2C221E]/75 font-semibold truncate max-w-xs md:max-w-sm">
            Original: {result.originalUrl}
          </p>
        </div>
      </div>

      {/* Link Mock Codeblock & Copy Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#F2F0EA]/55 border border-[#2C221E]/15 p-3 rounded-2xl">
        <div className="px-3 py-2 select-text font-mono text-[#2C221E] font-bold text-sm sm:text-base break-all flex-1">
          {result.shortUrl}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className={`py-3 px-6 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer ${
            copied
              ? 'bg-emerald-600 text-white shadow-[0_4px_15px_rgba(16,185,129,0.25)]'
              : 'bg-[#2C221E] hover:bg-[#44352E] text-[#F2F0EA] shadow-[0_4px_15px_rgba(44,34,30,0.15)]'
          }`}
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default ResultCard;
