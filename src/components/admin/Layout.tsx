'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({ id: '', username: '', name: '' });
  const [profileForm, setProfileForm] = useState({
    name: '',
    username: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileErrors, setProfileErrors] = useState<{[key: string]: string}>({});
  const [profileSubmitting, setProfileSubmitting] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      // Allow access to setup and login pages without authentication
      if (pathname === '/admin/setup' || pathname === '/admin/login') {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/admin/api/auth/verify');
        if (response.ok) {
          setIsAuthenticated(true);
          // Fetch user profile
          const profileResponse = await fetch('/admin/api/profile');
          if (profileResponse.ok) {
            const data = await profileResponse.json();
            setUserProfile(data.user);
            setProfileForm({
              name: data.user.name || '',
              username: data.user.username || '',
              currentPassword: '',
              newPassword: '',
              confirmPassword: ''
            });
          }
        } else {
          setIsAuthenticated(false);
          router.push('/admin/login');
        }
      } catch (error) {
        setIsAuthenticated(false);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [pathname, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('/admin/api/profile');
      if (response.ok) {
        const data = await response.json();
        setUserProfile(data.user);
        setProfileForm({
          name: data.user.name || '',
          username: data.user.username || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    }
  };

  const validatePassword = (password: string): string => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return 'Password must contain at least one special character';
    }
    return '';
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileErrors({});

    const errors: {[key: string]: string} = {};

    // Validate name
    if (!profileForm.name.trim()) {
      errors.name = 'Name is required';
    }

    // Validate username
    if (!profileForm.username.trim()) {
      errors.username = 'Username is required';
    } else if (profileForm.username.length < 3) {
      errors.username = 'Username must be at least 3 characters long';
    }

    // Validate password change if new password is provided
    if (profileForm.newPassword) {
      if (!profileForm.currentPassword) {
        errors.currentPassword = 'Current password is required to change password';
      }

      const passwordError = validatePassword(profileForm.newPassword);
      if (passwordError) {
        errors.newPassword = passwordError;
      }

      if (profileForm.newPassword !== profileForm.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    if (Object.keys(errors).length > 0) {
      setProfileErrors(errors);
      return;
    }

    setProfileSubmitting(true);

    try {
      const response = await fetch('/admin/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileForm.name.trim(),
          username: profileForm.username.trim(),
          ...(profileForm.newPassword && {
            currentPassword: profileForm.currentPassword,
            newPassword: profileForm.newPassword,
            confirmPassword: profileForm.confirmPassword
          })
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Profile updated successfully!');
        await fetchProfile();
        setProfileModalOpen(false);
        setProfileForm({
          name: profileForm.name.trim(),
          username: profileForm.username.trim(),
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setProfileErrors({});
      } else {
        setProfileErrors({ submit: data.error || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      setProfileErrors({ submit: 'Failed to update profile. Please try again.' });
    } finally {
      setProfileSubmitting(false);
    }
  };

  const openProfileModal = () => {
    setProfileForm({
      name: userProfile.name || '',
      username: userProfile.username || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
    setProfileErrors({});
    setProfileModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('/admin/api/auth/logout', { method: 'POST' });
      setIsAuthenticated(false);
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center animated-bg">
        <div className="glass-card rounded-2xl p-8 text-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white text-lg font-medium">Loading...</div>
        </div>
      </div>
    );
  }

  if (pathname === '/admin/login' || pathname === '/admin/setup') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  const navigation = [
    { 
      name: 'Dashboard', 
      href: '/admin/dashboard', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
        </svg>
      )
    },
    { 
      name: 'Team', 
      href: '/admin/team', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      )
    },
    { 
      name: 'Subscribers', 
      href: '/admin/subscribers', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      name: 'Bootcamp', 
      href: '/admin/bootcamp', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      )
    },
    { 
      name: 'Research', 
      href: '/admin/research', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
  ];

  return (
    <div className="h-screen bg-slate-900 flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed and full height */}
      <div className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-800 lg:translate-x-0 transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-24 flex items-center px-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Analyst Admin</h1>
                <p className="text-xs text-slate-400">Management Portal</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                  pathname === item.href
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span className="mr-3">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-slate-700">
            <div 
              onClick={openProfileModal}
              className="flex items-center space-x-3 mb-4 cursor-pointer hover:bg-slate-700/50 rounded-lg p-2 transition-colors -m-2"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'A'}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">
                  {userProfile.name || 'Admin User'}
                </p>
                <p className="text-xs text-slate-400">
                  {userProfile.username || 'Administrator'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg transition-all duration-200 cursor-pointer"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main content area - Scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top bar - Fixed */}
        <div className="bg-slate-800 border-b border-slate-700 h-24 flex items-center px-4 flex-shrink-0">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
                </h2>
                <p className="text-slate-400 text-sm">Welcome back to your admin portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 text-sm text-slate-400">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content - Scrollable */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Profile Modal */}
      {profileModalOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setProfileModalOpen(false);
            }
          }}
        >
          <div 
            className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setProfileModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <h2 className="text-xl font-bold text-white mb-4 pr-8">
              Edit Profile
            </h2>
            
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => {
                    setProfileForm({ ...profileForm, name: e.target.value });
                    if (profileErrors.name) {
                      setProfileErrors({ ...profileErrors, name: '' });
                    }
                  }}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    profileErrors.name 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-600 focus:ring-indigo-500'
                  }`}
                />
                {profileErrors.name && (
                  <p className="text-red-400 text-xs mt-1">{profileErrors.name}</p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={profileForm.username}
                  onChange={(e) => {
                    setProfileForm({ ...profileForm, username: e.target.value });
                    if (profileErrors.username) {
                      setProfileErrors({ ...profileErrors, username: '' });
                    }
                  }}
                  className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                    profileErrors.username 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-slate-600 focus:ring-indigo-500'
                  }`}
                />
                {profileErrors.username && (
                  <p className="text-red-400 text-xs mt-1">{profileErrors.username}</p>
                )}
              </div>

              {/* Password Change Section */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className="text-lg font-semibold text-white mb-4">Change Password (Optional)</h3>
                
                {/* Current Password */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={profileForm.currentPassword}
                    onChange={(e) => {
                      setProfileForm({ ...profileForm, currentPassword: e.target.value });
                      if (profileErrors.currentPassword) {
                        setProfileErrors({ ...profileErrors, currentPassword: '' });
                      }
                    }}
                    className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                      profileErrors.currentPassword 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-slate-600 focus:ring-indigo-500'
                    }`}
                  />
                  {profileErrors.currentPassword && (
                    <p className="text-red-400 text-xs mt-1">{profileErrors.currentPassword}</p>
                  )}
                </div>

                {/* New Password */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={profileForm.newPassword}
                    onChange={(e) => {
                      setProfileForm({ ...profileForm, newPassword: e.target.value });
                      if (profileErrors.newPassword) {
                        setProfileErrors({ ...profileErrors, newPassword: '' });
                      }
                    }}
                    className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                      profileErrors.newPassword 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-slate-600 focus:ring-indigo-500'
                    }`}
                  />
                  {profileErrors.newPassword && (
                    <p className="text-red-400 text-xs mt-1">{profileErrors.newPassword}</p>
                  )}
                  {!profileErrors.newPassword && profileForm.newPassword && (
                    <p className="text-gray-400 text-xs mt-1">
                      Password must be at least 8 characters with uppercase, lowercase, number, and special character
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={profileForm.confirmPassword}
                    onChange={(e) => {
                      setProfileForm({ ...profileForm, confirmPassword: e.target.value });
                      if (profileErrors.confirmPassword) {
                        setProfileErrors({ ...profileErrors, confirmPassword: '' });
                      }
                    }}
                    className={`w-full px-3 py-2 bg-slate-700 border rounded-lg text-white focus:outline-none focus:ring-2 ${
                      profileErrors.confirmPassword 
                        ? 'border-red-500 focus:ring-red-500' 
                        : 'border-slate-600 focus:ring-indigo-500'
                    }`}
                  />
                  {profileErrors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">{profileErrors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Submit Error */}
              {profileErrors.submit && (
                <div className="bg-red-900/30 border border-red-500 rounded-lg p-3">
                  <p className="text-red-400 text-sm">{profileErrors.submit}</p>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  disabled={profileSubmitting}
                  className="flex-1 py-2 rounded-lg transition-colors text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                >
                  {profileSubmitting ? 'Updating...' : 'Update Profile'}
                </button>
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(false)}
                  disabled={profileSubmitting}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-2 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
