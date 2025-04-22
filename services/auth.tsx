import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

type UserType = {
  id: string;
  email: string;
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

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const res = await fetch(AUTH_API_URL);

        if (!res.ok) {
          throw new Error('Authentication check failed');
        }

        const { data } = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

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
