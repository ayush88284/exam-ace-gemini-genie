
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
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      toast.success('Signed in successfully');
      return true;
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      return false;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            email_confirmed: false,
          }
        }
      });

      if (error) {
        throw error;
      }

      // Since we're using OTP instead of email confirmation link
      // We'll simulate OTP sending here (in a real app, this would send through a secure channel)
      // Note: Supabase doesn't have a built-in OTP method, so this is a simplified mock
      localStorage.setItem('pendingVerification', email);
      
      toast.success('Please check your email for verification code');
      return true;
    } catch (error: any) {
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
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      toast.success('Signed out successfully');
    } catch (error: any) {
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
