import { Link } from 'lucide-react';

function Header() {
  return (
    <header className="flex flex-col items-center">
      {/* Brand Logo Box */}
      <div className="flex items-center gap-3.5 mb-3 select-none">
        <div className="bg-[#2C221E] p-2.5 rounded-2xl shadow-[0_4px_15px_rgba(44,34,30,0.15)] flex items-center justify-center">
          <Link className="w-7 h-7 text-[#F2F0EA] stroke-[2.5]" />
        </div>
        <span className="text-4xl font-extrabold tracking-tight text-[#2C221E] font-brand-serif">
          Shrinkr
        </span>
      </div>

      {/* Brand Subheader */}
      <p className="text-[#2C221E]/80 text-center mb-8 font-medium text-lg max-w-sm font-brand-serif italic select-none">
        Frustrated with long URLs? <br />
        Paste it down and make it simpler.
      </p>
    </header>
  );
}

export default Header;
