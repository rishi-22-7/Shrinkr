import { useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

function Form({ onShorten, loading }) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) return;

    const success = await onShorten(originalUrl, customCode);
    if (success) {
      setOriginalUrl('');
      setCustomCode('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Destination Link Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#2C221E]/95 pl-1">
          Destination Link
        </label>
        <input
          type="text"
          placeholder="Paste your long link here..."
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          disabled={loading}
          className="w-full glass-input px-5 py-4 rounded-xl text-[#2C221E] placeholder-[#a89a92] outline-none text-base transition-all duration-300 focus:ring-4 focus:ring-[#2C221E]/5 disabled:opacity-50"
        />
      </div>

      {/* Custom Name / Short Code Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#2C221E]/95 pl-1 flex justify-between items-center">
          <span>Custom Name (Optional)</span>
          <span className="text-[9px] text-[#2C221E]/60 italic normal-case">a-z, 0-9, - or _ only</span>
        </label>
        <div className="relative flex items-stretch">
          <div className="bg-[#F2F0EA]/70 border border-r-0 border-[#2C221E]/25 rounded-l-xl px-4 flex items-center text-sm font-bold text-[#2C221E]/70 select-none">
            shrinkr/
          </div>
          <input
            type="text"
            placeholder="e.g. my-cool-link"
            value={customCode}
            onChange={(e) => setCustomCode(e.target.value)}
            disabled={loading}
            className="w-full glass-input border-l-0 rounded-l-none px-5 py-4 rounded-r-xl text-[#2C221E] placeholder-[#a89a92] outline-none text-base transition-all duration-300 focus:ring-4 focus:ring-[#2C221E]/5 disabled:opacity-50"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !originalUrl.trim()}
        className="bg-[#2C221E] hover:bg-[#44352E] text-[#F2F0EA] font-bold py-4.5 rounded-xl shadow-[0_4px_15px_rgba(44,34,30,0.15)] hover:shadow-[0_4px_25px_rgba(44,34,30,0.25)] transition-all duration-300 transform active:scale-95 disabled:opacity-55 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer mt-2 text-base"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Shrinking...</span>
          </>
        ) : (
          <>
            <span>Shrink URL</span>
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </form>
  );
}

export default Form;
