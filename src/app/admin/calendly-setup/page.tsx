'use client';

import { useState } from 'react';

export default function CalendlySetupPage() {
  const [accessToken, setAccessToken] = useState('');
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchUserInfo = async () => {
    if (!accessToken.trim()) {
      setError('Please enter an access token');
      return;
    }

    setIsLoading(true);
    setError('');
    setUserInfo(null);

    try {
      // Call Calendly API directly from client with provided token
      const response = await fetch('https://api.calendly.com/users/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Invalid access token or API error');
      }

      const data = await response.json();
      setUserInfo(data.resource);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user info');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const clearAndReset = () => {
    setAccessToken('');
    setUserInfo(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                Calendly Setup Helper
              </h1>
              <p className="text-gray-400" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                Get Calendly User URI for new analysts
              </p>
            </div>
            <button
              onClick={clearAndReset}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors text-sm font-semibold"
              style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}
            >
              🔄 Clear & Reset
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-[#1F1F1F] rounded-2xl p-6 mb-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold mb-4" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
            📋 Instructions
          </h2>
          <ol className="space-y-3 text-gray-300" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
            <li className="flex gap-3">
              <span className="font-bold text-purple-400">1.</span>
              <span>Ask the analyst to log in to their Calendly account at <a href="https://calendly.com" target="_blank" className="text-purple-400 hover:underline">calendly.com</a></span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-400">2.</span>
              <span>Have them go to: <strong>Integrations → API & Webhooks</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-400">3.</span>
              <span>Click <strong>"Get a Personal Access Token"</strong></span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-400">4.</span>
              <span>Copy the token (it's only shown once!)</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold text-purple-400">5.</span>
              <span>Paste the token below and click "Get User Info"</span>
            </li>
          </ol>
        </div>

        {/* Input Form */}
        <div className="bg-[#1F1F1F] rounded-2xl p-6 mb-6 border border-gray-700/50">
          <label className="block text-lg font-semibold mb-3" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
            Calendly Personal Access Token
          </label>
          <input
            type="password"
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            placeholder="Paste the access token here..."
            className="w-full bg-black border-2 border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:border-purple-400 transition-colors mb-4"
            style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}
          />
          
          <button
            onClick={fetchUserInfo}
            disabled={isLoading || !accessToken.trim()}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              isLoading || !accessToken.trim()
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                : 'bg-purple-500 text-white hover:bg-purple-600'
            }`}
            style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}
          >
            {isLoading ? 'Fetching...' : 'Get User Info'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
              ❌ {error}
            </div>
          )}
        </div>

        {/* Results */}
        {userInfo && (
          <div className="bg-[#1F1F1F] rounded-2xl p-6 border border-purple-500/30">
            <h2 className="text-xl font-semibold mb-4 text-purple-400" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
              ✅ User Information Retrieved
            </h2>

            {/* User Details */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm text-gray-400 block mb-1">Name</label>
                <div className="bg-black rounded-lg p-3 text-white font-mono">
                  {userInfo.name}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">Email</label>
                <div className="bg-black rounded-lg p-3 text-white font-mono">
                  {userInfo.email}
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">Scheduling URL</label>
                <div className="bg-black rounded-lg p-3 text-white font-mono break-all">
                  {userInfo.scheduling_url}
                </div>
              </div>
            </div>

            {/* User URI (Most Important) */}
            <div className="border-t border-gray-700 pt-6">
              <div className="bg-gradient-to-r from-purple-500/10 to-transparent rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold mb-2 text-purple-400" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                  🎯 Calendly User URI (Copy This!)
                </h3>
                <p className="text-sm text-gray-400 mb-3">
                  This is what you need to add to your environment variables or database
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 bg-black rounded-lg p-3 text-white font-mono break-all text-sm">
                    {userInfo.uri}
                  </div>
                  <button
                    onClick={() => copyToClipboard(userInfo.uri)}
                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors whitespace-nowrap"
                    style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}
                  >
                    📋 Copy
                  </button>
                </div>
              </div>

              {/* Instructions for Next Steps */}
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-yellow-400" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                  📝 Next Steps
                </h4>
                <p className="text-sm text-gray-300 mb-3">
                  Add this URI to your <code className="bg-black px-2 py-1 rounded">.env.local</code> file:
                </p>
                <div className="bg-black rounded-lg p-3 font-mono text-sm overflow-x-auto">
                  <code className="text-green-400">
                    CALENDLY_ANALYST_X_URI={userInfo.uri}
                  </code>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Replace X with the analyst's ID number (0-7)
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-gray-400" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
            🔒 <strong>Privacy Note:</strong> The access token is only used temporarily in your browser to fetch the User URI. 
            It is never stored or sent to any server except Calendly's official API. Clear this page when done.
          </p>
        </div>
      </div>
    </div>
  );
}

