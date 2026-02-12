'use client';

import { useState, useEffect } from 'react';

interface PublicUserRow {
  _id: string;
  email: string;
  name: string | null;
  status: 'active' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

export default function SubscribersAdmin() {
  const [users, setUsers] = useState<PublicUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'paginated' | 'list'>('paginated');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/admin/api/users');
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users ?? []);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const toggleBlock = async (id: string, currentStatus: 'active' | 'blocked') => {
    const newStatus = currentStatus === 'blocked' ? 'active' : 'blocked';
    setUpdatingId(id);
    try {
      const response = await fetch(`/admin/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchUsers();
      } else {
        const data = await response.json().catch(() => ({}));
        alert(data.error || 'Failed to update user');
      }
    } catch {
      alert('Network error');
    } finally {
      setUpdatingId(null);
    }
  };

  // Pagination logic
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = viewMode === 'paginated'
    ? users.slice(startIndex, endIndex)
    : users;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewModeChange = (mode: 'paginated' | 'list') => {
    setViewMode(mode);
    setCurrentPage(1); // Reset to first page when changing view
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="text-center sm:text-left mb-4 sm:mb-0">
          <h1 className="text-3xl font-bold text-white mb-2">
            User Management
          </h1>
          <p className="text-slate-400">
            Manage users who have signed up to the website
          </p>
        </div>
        
        {/* View Toggle */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">View:</span>
          <div className="flex bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => handleViewModeChange('paginated')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'paginated'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Pages
            </button>
            <button
              onClick={() => handleViewModeChange('list')}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'list'
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Users ({users.length})
              {viewMode === 'paginated' && (
                <span className="text-sm text-slate-400 ml-2">
                  (Page {currentPage} of {totalPages})
                </span>
              )}
            </h2>
            {viewMode === 'paginated' && (
              <span className="text-sm text-slate-400">
                Showing {startIndex + 1}-{Math.min(endIndex, users.length)} of {users.length}
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-700">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Date joined
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 divide-y divide-slate-700">
              {currentUsers.map((user) => (
                <tr key={user._id} className="hover:bg-slate-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => toggleBlock(user._id, user.status)}
                      disabled={updatingId === user._id}
                      title={user.status === 'blocked' ? 'Unblock user' : 'Block user'}
                      className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        user.status === 'blocked'
                          ? 'text-green-400 hover:bg-green-500/20 border border-green-500/30'
                          : 'text-red-400 hover:bg-red-500/20 border border-red-500/30'
                      }`}
                    >
                      {updatingId === user._id ? (
                        <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      ) : user.status === 'blocked' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <p className="text-slate-400">No users yet.</p>
            <p className="text-slate-500 text-sm mt-1">Users will appear here once they sign up to the website.</p>
          </div>
        )}

        {/* Pagination Controls */}
        {viewMode === 'paginated' && users.length > itemsPerPage && (
          <div className="px-6 py-4 border-t border-slate-700">
            <div className="flex items-center justify-between">
              <div className="text-sm text-slate-400">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm font-medium text-slate-300 hover:text-white disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                          currentPage === pageNum
                            ? 'bg-purple-600 text-white'
                            : 'text-slate-300 hover:text-white hover:bg-slate-700'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm font-medium text-slate-300 hover:text-white disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
