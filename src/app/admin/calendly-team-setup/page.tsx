'use client';

import { useState, useEffect } from 'react';

export default function CalendlyTeamSetupPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAllUsers = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/calendly/list-users');
      
      if (!response.ok) {
        throw new Error('Failed to fetch users. Make sure CALENDLY_ACCESS_TOKEN is set in .env.local');
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    alert(`${label} copied to clipboard!`);
  };

  const copyAllEnvVars = () => {
    const envVars = users.map((user, index) => 
      `CALENDLY_ANALYST_${index}_URI=${user.uri}`
    ).join('\n');
    
    navigator.clipboard.writeText(envVars);
    alert('All environment variables copied! Paste them into your .env.local file.');
  };

  const refreshData = () => {
    setUsers([]);
    setError('');
    fetchAllUsers();
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                Calendly Team Setup
              </h1>
              <p className="text-gray-400" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                Automatically discover all team members in your Calendly organization
              </p>
            </div>
            <button
              onClick={refreshData}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors text-sm font-semibold"
              style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}
            >
              🔄 Refresh Data
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-[#1F1F1F] rounded-2xl p-6 mb-6 border border-gray-700/50">
          <h2 className="text-xl font-semibold mb-4 text-purple-400" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
            📋 How This Works
          </h2>
          <div className="space-y-2 text-gray-300 text-sm" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
            <p>✅ <strong>With Calendly Organization Plan:</strong></p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Admin gets ONE access token from Calendly</li>
              <li>Add it to .env.local as CALENDLY_ACCESS_TOKEN</li>
              <li>This page automatically lists ALL team members</li>
              <li>Copy all URIs at once with one click</li>
              <li>No need for individual tokens! 🎉</li>
            </ul>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-2xl p-6 mb-6">
            <h3 className="text-red-400 font-semibold mb-2">❌ Error</h3>
            <p className="text-gray-300">{error}</p>
            <button
              onClick={fetchAllUsers}
              className="mt-4 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Users List */}
        {!isLoading && !error && users.length > 0 && (
          <>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                Team Members ({users.length})
              </h2>
              <button
                onClick={copyAllEnvVars}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors font-semibold"
                style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}
              >
                📋 Copy All URIs
              </button>
            </div>

            <div className="space-y-4">
              {users.map((user, index) => (
                <div
                  key={user.uri}
                  className="bg-[#1F1F1F] rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    {user.avatar_url && (
                      <img
                        src={user.avatar_url}
                        alt={user.name}
                        className="w-16 h-16 rounded-full"
                      />
                    )}

                    {/* User Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                          {user.name}
                        </h3>
                        <span className="px-3 py-1 bg-purple-400/12 border border-purple-400 text-purple-400 rounded-full text-xs">
                          ID: {index}
                        </span>
                        {user.role && (
                          <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs">
                            {user.role}
                          </span>
                        )}
                      </div>

                      <p className="text-gray-400 text-sm mb-4">{user.email}</p>

                      {/* User URI */}
                      <div className="space-y-2">
                        <label className="text-sm text-gray-500 block">Calendly User URI:</label>
                        <div className="flex gap-2">
                          <div className="flex-1 bg-black rounded-lg p-3 font-mono text-xs text-gray-300 break-all">
                            {user.uri}
                          </div>
                          <button
                            onClick={() => copyToClipboard(user.uri, 'User URI')}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors whitespace-nowrap text-sm"
                          >
                            📋 Copy
                          </button>
                        </div>

                        {/* Environment Variable Format */}
                        <div className="mt-2 p-3 bg-gradient-to-r from-purple-500/10 to-transparent rounded-lg">
                          <label className="text-xs text-purple-400 block mb-1">Add to .env.local:</label>
                          <div className="flex gap-2">
                            <code className="flex-1 bg-black rounded px-3 py-2 text-xs text-green-400 overflow-x-auto">
                              CALENDLY_ANALYST_{index}_URI={user.uri}
                            </code>
                            <button
                              onClick={() => copyToClipboard(`CALENDLY_ANALYST_${index}_URI=${user.uri}`, 'Environment variable')}
                              className="px-3 py-1 bg-purple-500 hover:bg-purple-600 rounded text-xs whitespace-nowrap"
                            >
                              Copy Line
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Scheduling URL */}
                      {user.scheduling_url && (
                        <div className="mt-3">
                          <label className="text-xs text-gray-500 block mb-1">Public Scheduling Page:</label>
                          <a
                            href={user.scheduling_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-purple-400 hover:text-purple-300 text-sm underline"
                          >
                            {user.scheduling_url}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Complete .env.local Preview */}
            <div className="mt-8 bg-[#1F1F1F] rounded-2xl p-6 border border-purple-500/30">
              <h3 className="text-lg font-semibold mb-4 text-purple-400" style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}>
                📄 Complete .env.local Configuration
              </h3>
              <div className="bg-black rounded-lg p-4 font-mono text-xs overflow-x-auto">
                <pre className="text-green-400">
{`# Calendly Configuration
CALENDLY_ACCESS_TOKEN=your_admin_token_here

# Team Member URIs
${users.map((user, index) => `CALENDLY_ANALYST_${index}_URI=${user.uri}`).join('\n')}`}
                </pre>
              </div>
              <button
                onClick={() => {
                  const envContent = `# Calendly Configuration\nCALENDLY_ACCESS_TOKEN=your_admin_token_here\n\n# Team Member URIs\n${users.map((user, index) => `CALENDLY_ANALYST_${index}_URI=${user.uri}`).join('\n')}`;
                  copyToClipboard(envContent, 'Complete configuration');
                }}
                className="mt-4 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors font-semibold w-full"
                style={{ fontFamily: 'Gilroy-SemiBold, sans-serif' }}
              >
                📋 Copy All Configuration
              </button>
            </div>
          </>
        )}

        {/* No Users Found */}
        {!isLoading && !error && users.length === 0 && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6">
            <p className="text-gray-300">
              No team members found. Make sure your access token has organization access.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

