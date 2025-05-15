
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase, SupabaseUser, getUserName } from '@/lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasCompletedTest: boolean;
  checkTestCompletion: () => Promise<boolean>;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCompletedTest, setHasCompletedTest] = useState(false);

  // Function to convert Supabase User to our app's User format
  const formatUser = (supabaseUser: SupabaseUser | null): User | null => {
    if (!supabaseUser) return null;
    
    return {
      id: supabaseUser.id,
      name: getUserName(supabaseUser),
      email: supabaseUser.email || ''
    };
  };

  const checkTestCompletion = async (userId?: string) => {
    try {
      const id = userId || user?.id;
      
      if (!id) return false;
      
      const { data, error } = await supabase
        .from('test_results')
        .select('id')
        .eq('user_id', id)
        .limit(1);
        
      if (error) {
        console.error('Error checking test completion:', error);
        return false;
      }
      
      const completed = data && data.length > 0;
      setHasCompletedTest(completed);
      return completed;
    } catch (error) {
      console.error('Error checking test completion:', error);
      return false;
    }
  };

  // Check for existing session on mount
  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          setIsLoading(false);
          return;
        }
        
        if (session) {
          const { data: { user: supabaseUser } } = await supabase.auth.getUser();
          const formattedUser = formatUser(supabaseUser as SupabaseUser);
          setUser(formattedUser);
          
          if (formattedUser) {
            await checkTestCompletion(formattedUser.id);
          }
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          const { user: supabaseUser } = session;
          const formattedUser = formatUser(supabaseUser as SupabaseUser);
          setUser(formattedUser);
          
          if (formattedUser) {
            await checkTestCompletion(formattedUser.id);
          }
        } else {
          setUser(null);
          setHasCompletedTest(false);
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
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (data.user) {
        const formattedUser = formatUser(data.user as SupabaseUser);
        setUser(formattedUser);
        
        if (formattedUser) {
          await checkTestCompletion(formattedUser.id);
        }
        
        toast({
          title: "Login successful",
          description: "You are now logged in.",
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) {
        toast({
          title: "Google login failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    } catch (error) {
      console.error('Error during Google login:', error);
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
          },
        },
      });

      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      if (data.user) {
        const formattedUser = formatUser(data.user as SupabaseUser);
        setUser(formattedUser);
        setHasCompletedTest(false);
        
        toast({
          title: "Account created",
          description: "Your account has been created successfully.",
        });
      }
    } catch (error) {
      console.error('Error during signup:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Logout failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }
      
      setUser(null);
      setHasCompletedTest(false);
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      signInWithGoogle, 
      signup, 
      logout, 
      hasCompletedTest,
      checkTestCompletion 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
