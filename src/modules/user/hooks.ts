// ═══════════════════════════════════════════════════════════════════
// USER MODULE - React Hooks
// ═══════════════════════════════════════════════════════════════════

import { useState, useCallback, useMemo } from 'react';
import { User, Message, AuthState } from './types';
import { DEMO_USER, USER_STORAGE_KEY, MESSAGES_STORAGE_KEY } from './constants';

// ═══════════════════════════════════════════════════════════════════
// USER HOOK
// ═══════════════════════════════════════════════════════════════════

export const useUser = () => {
  const [user] = useState<User>(() => {
    const stored = localStorage.getItem(USER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEMO_USER;
  });

  return { user };
};

// ═══════════════════════════════════════════════════════════════════
// AUTH HOOK
// ═══════════════════════════════════════════════════════════════════

export const useAuth = () => {
  const [authState] = useState<AuthState>({
    isAuthenticated: true,
    isDemo: true,
    loading: false,
  });

  const isPremium = useCallback(() => true, []);

  const login = useCallback(async () => {
    console.log('Login called');
  }, []);

  const register = useCallback(async () => {
    console.log('Register called');
  }, []);

  const loginWithGoogle = useCallback(async () => {
    console.log('Google login called');
  }, []);

  const logout = useCallback(async () => {
    console.log('Logout called');
  }, []);

  return {
    ...authState,
    isPremium,
    login,
    register,
    loginWithGoogle,
    logout,
  };
};

// ═══════════════════════════════════════════════════════════════════
// MESSAGES HOOK
// ═══════════════════════════════════════════════════════════════════

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>(() => {
    const stored = localStorage.getItem(MESSAGES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const markMessagesAsRead = useCallback(() => {
    setMessages(prev => {
      const updated = prev.map(msg => ({ ...msg, read: true }));
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const unreadCount = useMemo(() => 
    messages.filter(m => !m.read).length,
  [messages]);

  return {
    messages,
    markMessagesAsRead,
    unreadCount,
  };
};
