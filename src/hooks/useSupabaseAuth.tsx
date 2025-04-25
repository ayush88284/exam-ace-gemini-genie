
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // First set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log("Auth state changed:", event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log("Initial session check:", currentSession?.user?.email);
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Attempting sign in with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign in error:", error.message);
        throw error;
      }

      console.log("Sign in successful:", data?.user?.email);
      toast.success('Signed in successfully');
      return true;
    } catch (error: any) {
      console.error("Sign in exception:", error.message);
      toast.error(error.message || 'Error signing in');
      return false;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log("Attempting sign up with:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });

      if (error) {
        console.error("Sign up error:", error.message);
        throw error;
      }

      console.log("Sign up response:", data);
      
      if (data.user && !data.user.email_confirmed_at) {
        toast.success('Please check your email to confirm your account');
      } else {
        toast.success('Account created successfully');
      }
      
      return true;
    } catch (error: any) {
      console.error("Sign up exception:", error.message);
      toast.error(error.message || 'Error signing up');
      return false;
    }
  };

  const verifyOTP = async (email: string, otp: string) => {
    try {
      // In a real implementation, this would call a server endpoint to verify the OTP
      // For demo purposes, we'll just simulate verification with a 6-digit code
      const pendingEmail = localStorage.getItem('pendingVerification');
      
      // Simple mock verification - in a real app, this would be a secure API call
      if (email === pendingEmail && otp.length === 6) {
        // Simulate successful verification
        localStorage.removeItem('pendingVerification');
        
        // In a real app, this would update the user's status in the database
        toast.success('Email verified successfully');
        return true;
      } else {
        throw new Error('Invalid verification code');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error verifying email');
      return false;
    }
  };

  const signOut = async () => {
    try {
      console.log("Attempting sign out");
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Sign out error:", error.message);
        throw error;
      }
      
      console.log("Sign out successful");
      toast.success('Signed out successfully');
    } catch (error: any) {
      console.error("Sign out exception:", error.message);
      toast.error(error.message || 'Error signing out');
    }
  };

  return {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    verifyOTP,
  };
}
