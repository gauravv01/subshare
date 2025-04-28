import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../lib/axiosInstance';

interface Session {
  id: string;
  device: string;
  browser: string;
  os: string;
  location: string;
  lastUsed: string;
  isActive: boolean;
  isCurrent: boolean;
}

interface SessionContextType {
  sessions: Session[];
  isLoading: boolean;
  error: string | null;
  fetchSessions: () => Promise<void>;
  terminateSession: (sessionId: string) => Promise<void>;
  terminateAllOtherSessions: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/sessions');
      setSessions(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch sessions');
    } finally {
      setIsLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/sessions/${sessionId}`);
      setSessions(prev => prev.filter(session => session.id !== sessionId));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to terminate session');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const terminateAllOtherSessions = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.post('/sessions/terminate-all');
      setSessions(prev => prev.filter(session => session.isCurrent));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to terminate other sessions');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SessionContext.Provider 
      value={{ 
        sessions,
        isLoading,
        error,
        fetchSessions,
        terminateSession,
        terminateAllOtherSessions
      }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export const useSessions = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSessions must be used within a SessionProvider');
  }
  return context;
}; 