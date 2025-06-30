
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null | undefined; // undefined means still loading
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>(undefined); // Start as undefined (loading)
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error checking session:', error);
          setUser(null);
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          console.log("Found existing session for user:", session.user.email);
          const { id, email, user_metadata } = session.user;
          
          setUser({
            id,
            email: email || '',
            name: user_metadata?.name || email?.split('@')[0] || '',
          });
        } else {
          console.log("No active session found");
          setUser(null);
        }
      } catch (error) {
        console.error('Error checking auth session:', error);
        setUser(null); 
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        if (session?.user) {
          const { id, email, user_metadata } = session.user;
          
          setUser({
            id,
            email: email || '',
            name: user_metadata?.name || email?.split('@')[0] || '',
          });
        } else {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      
      console.log("Login successful:", data.user?.email);
    } catch (error: any) {
      console.error("Login error:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            name,
          }
        }
      });
      
      if (error) throw error;
      
      console.log("Signup successful:", data.user?.email);
    } catch (error: any) {
      console.error("Signup error:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      // Get window location to dynamically set the redirect URL
      const { origin } = window.location;
      
      console.log("Starting Google sign-in process with redirect URL:", origin);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/payment`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        },
      });
      
      if (error) throw error;
      
      console.log("Google sign-in initiated", data);
    } catch (error: any) {
      console.error("Google sign-in error:", error.message);
      throw error;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      console.log("Starting logout process...");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Logout error:", error.message);
        throw error;
      }
      
      console.log("Logout successful");
      // Force user to null immediately
      setUser(null);
    } catch (error: any) {
      console.error("Logout error:", error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signup, 
      signInWithGoogle,
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
