"import React, { createContext, useContext } from 'react';

// ═══════════════════════════════════════════════════════════════════
// IMPORTS DEPUIS MODULES (SOURCE UNIQUE)
// ═══════════════════════════════════════════════════════════════════
import { useUser, useAuth, useMessages } from '@/modules/user';
import { useUIState } from '@/modules/ui-state';
import { useFriends, useSendFriendRequest, useShareTask, Friend } from '@/modules/friends';

// ═══════════════════════════════════════════════════════════════════
// CONTEXT TYPE - Façade pour rétrocompatibilité
// ═══════════════════════════════════════════════════════════════════

interface AppContextType {
  // User & Auth (from @/modules/user)
  user: { id: string; name: string; email: string; avatar: string };
  loading: boolean;
  isAuthenticated: boolean;
  isDemo: boolean;
  isPremium: () => boolean;
  
  // Messages (from @/modules/user)
  messages: { id: string; read: boolean; content: string }[];
  markMessagesAsRead: () => void;
  
  // Colors (from @/modules/ui-state)
  colorSettings: Record<string, string>;
  favoriteColors: string[];
  setFavoriteColors: React.Dispatch<React.SetStateAction<string[]>>;
  
  // Friends (from @/modules/friends)
  friends: Friend[];
  sendFriendRequest: (email: string) => void;
  shareTask: (taskId: string, friendId: string, role?: string) => void;
  
  // Priority Range (from @/modules/ui-state)
  priorityRange: [number, number];
  setPriorityRange: (range: [number, number]) => void;
  
  // Auth stubs (from @/modules/user)
  login: () => Promise<void>;
  register: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const TaskContext = createContext<AppContextType | undefined>(undefined);

/**
 * TaskProvider - Façade Provider qui agrège les modules
 * 
 * ═══════════════════════════════════════════════════════════════════
 * ARCHITECTURE MODULAIRE:
 * - User/Auth: @/modules/user
 * - UI State: @/modules/ui-state  
 * - Friends: @/modules/friends
 * - Tasks: @/modules/tasks
 * - Events: @/modules/events
 * - Categories: @/modules/categories
 * - Lists: @/modules/lists
 * - Habits: @/modules/habits
 * - OKRs: @/modules/okrs
 * ═══════════════════════════════════════════════════════════════════
 */
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // ═══════════════════════════════════════════════════════════════════
  // HOOKS MODULES
  // ═══════════════════════════════════════════════════════════════════
  
  // User module
  const { user } = useUser();
  const { isAuthenticated, isDemo, loading, isPremium, login, register, loginWithGoogle, logout } = useAuth();
  const { messages, markMessagesAsRead } = useMessages();
  
  // UI State module
  const { colorSettings, favoriteColors, setFavoriteColors, priorityRange, setPriorityRange } = useUIState();
  
  // Friends module (React Query)
  const { data: friends = [] } = useFriends();
  const sendFriendRequestMutation = useSendFriendRequest();
  const shareTaskMutation = useShareTask();

  // ═══════════════════════════════════════════════════════════════════
  // WRAPPER FUNCTIONS (pour rétrocompatibilité)
  // ═══════════════════════════════════════════════════════════════════
  
  const sendFriendRequest = (email: string) => {
    sendFriendRequestMutation.mutate({ email });
  };

  const shareTask = (taskId: string, friendId: string, role?: string) => {
    shareTaskMutation.mutate({ taskId, friendId, role: role as 'viewer' | 'editor' });
  };

  // ═══════════════════════════════════════════════════════════════════
  // CONTEXT VALUE
  // ═══════════════════════════════════════════════════════════════════
  const value: AppContextType = {
    // User & Auth
    user,
    loading,
    isAuthenticated,
    isDemo,
    isPremium,
    
    // Messages
    messages,
    markMessagesAsRead,
    
    // Colors
    colorSettings,
    favoriteColors,
    setFavoriteColors: setFavoriteColors as React.Dispatch<React.SetStateAction<string[]>>,
    
    // Friends
    friends,
    sendFriendRequest,
    shareTask,
    
    // Priority Range
    priorityRange,
    setPriorityRange,
    
    // Auth
    login,
    register,
    loginWithGoogle,
    logout,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

/**
 * useAppContext - Hook principal pour accéder au contexte global
 * @deprecated Préférer les hooks spécifiques des modules:
 * - useUser, useAuth, useMessages from '@/modules/user'
 * - useUIState, useFavoriteColors, usePriorityRange from '@/modules/ui-state'
 * - useFriends from '@/modules/friends'
 */
export const useAppContext = (): AppContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within a TaskProvider');
  }
  return context;
};

/**
 * @deprecated Use useAppContext instead - kept for backward compatibility
 */
export const useTasks = useAppContext;
"
