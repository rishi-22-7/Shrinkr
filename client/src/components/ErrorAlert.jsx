import { AlertCircle } from 'lucide-react';

function ErrorAlert({ message }) {
  return (
    <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 p-4 rounded-2xl text-red-700 text-sm animate-fade-in shadow-[0_2px_10px_rgba(239,68,68,0.02)]">
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <span className="font-semibold">{message}</span>
    </div>
  );
}

export default ErrorAlert;
