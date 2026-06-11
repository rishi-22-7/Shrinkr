import { useState } from 'react';
import Header from './components/Header';
import Form from './components/Form';
import ResultCard from './components/ResultCard';
import ErrorAlert from './components/ErrorAlert';
import Footer from './components/Footer';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleShorten = async (originalUrl, customCode) => {
    setLoading(true);
    setError('');
    setResult(null);

    let formattedUrl = originalUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const payload = { originalUrl: formattedUrl };
    if (customCode.trim()) {
      payload.customCode = customCode.trim();
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/url/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong while shortening the URL.');
      }

      setResult(data);
      return true; // Returns true on success to notify the Form component to clear fields
    } catch (err) {
      setError(err.message || 'Failed to connect to the server. Please check if the server is running.');
      return false; // Returns false on failure
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#F2F0EA] grid-bg flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden select-none font-brand-sans">
      {/* Main Content Container */}
      <main className="w-full max-w-xl z-10 flex flex-col items-center">
        {/* Brand Header */}
        <Header />
        
        {/* URL Shrinker Form Card */}
        <div className="w-full glass-panel p-6 md:p-8 rounded-3xl transition-all duration-500 animate-fade-in">
          <Form onShorten={handleShorten} loading={loading} />
          
          {/* Validation/API Error Alert */}
          {error && <ErrorAlert message={error} />}
        </div>

        {/* Animated Result Card */}
        {result && <ResultCard result={result} />}
      </main>

      {/* Modern minimal footer */}
      <Footer />
    </div>
  );
}

export default App;
