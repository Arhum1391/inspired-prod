'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  isPaid: boolean;
  subscriptionStatus?: string | null;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const normalizeUser = (rawUser: any): User => ({
    id: rawUser.id,
    email: rawUser.email,
    name: rawUser.name ?? undefined,
    isPaid: rawUser.isPaid ?? false,
    subscriptionStatus: rawUser.subscriptionStatus ?? (rawUser.isPaid ? 'active' : 'none'),
  });

  useEffect(() => {
    // Fetch user from server to sync with server-side auth
    const fetchUser = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/auth/me', {
          credentials: 'include', // Include cookies
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            const normalized = normalizeUser(data.user);
            setUser(normalized);
            localStorage.setItem('user', JSON.stringify(normalized));
          } else {
            // No user data, clear local storage
            localStorage.removeItem('user');
            setUser(null);
          }
        } else {
          // Not authenticated on server, clear local storage
          localStorage.removeItem('user');
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        // On error, try to use local storage as fallback
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          try {
            const parsedUser = JSON.parse(savedUser);
            const normalized = normalizeUser(parsedUser);
            setUser(normalized);
          } catch (e) {
            localStorage.removeItem('user');
            setUser(null);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();

    // Set up interval to check auth status periodically (every 5 minutes)
    const authCheckInterval = setInterval(() => {
      fetchUser();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(authCheckInterval);
  }, []);

  const login = async (userData: User) => {
    const normalized = normalizeUser(userData);
    setUser(normalized);
    localStorage.setItem('user', JSON.stringify(normalized));
    
    // Verify with server to ensure token is valid
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          // Update with server data (may have more complete info)
          const refreshed = normalizeUser(data.user);
          setUser(refreshed);
          localStorage.setItem('user', JSON.stringify(refreshed));
        }
      }
    } catch (error) {
      console.error('Error verifying login:', error);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Error logging out:', error);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

