import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { useRouter } from 'next/router';

type UserType = {
  id: string;
  email: string;
  needsRefresh?: boolean;
} | null;

type AuthContextType = {
  user: UserType;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

// Auth API URL
const AUTH_API_URL = '/api/v1/auth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Use ref to avoid stale closures
  const userRef = useRef(user);
  userRef.current = user;

  // Function to refresh the session
  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch(AUTH_API_URL, {
        method: 'PUT',
      });

      if (!res.ok) {
        throw new Error('Session refresh failed');
      }

      const { data } = await res.json();
      setUser(data);
    } catch (error) {
      console.error('Error refreshing session:', error);
      // If refresh fails, user might need to log in again
      setUser(null);
    }
  }, []);

  // Check if user is already logged in
  const checkUser = useCallback(
    async (isInitialCheck = false) => {
      try {
        const res = await fetch(AUTH_API_URL);

        if (!res.ok) {
          throw new Error('Authentication check failed');
        }

        const { data } = await res.json();
        setUser(data);

        // Check if session needs to be refreshed
        if (data && data.needsRefresh) {
          await refreshSession();
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
      } finally {
        if (isInitialCheck) {
          setLoading(false);
        }
      }
    },
    [refreshSession],
  );

  useEffect(() => {
    // Initial auth check
    checkUser(true);

    // Re-validate session when user returns to tab
    const handleVisibilityChange = () => {
      if (!document.hidden && userRef.current) {
        // User returned to the tab and has a session - re-validate it
        checkUser();
      }
    };

    // Add event listener for tab visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Periodic session validation (every 5 minutes)
    const interval = setInterval(
      () => {
        if (userRef.current && !document.hidden) {
          checkUser();
        }
      },
      5 * 60 * 1000,
    ); // 5 minutes

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearInterval(interval);
    };
  }, [checkUser]);

  const signIn = async (email: string, password: string) => {
    const res = await fetch(AUTH_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || 'Authentication failed');
    }

    const { data } = await res.json();
    setUser(data);
  };

  const signOut = async () => {
    try {
      const res = await fetch(AUTH_API_URL, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Sign out failed');
      }

      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
