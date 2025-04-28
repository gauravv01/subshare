import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../lib/axiosInstance';

interface SecurityContextType {
  twoFactorEnabled: boolean;
  twoFactorMethod: '2FA_APP' | 'SMS' | 'EMAIL' | null;
  isLoading: boolean;
  error: string | null;
  setup2FA: (method: '2FA_APP' | 'SMS' | 'EMAIL') => Promise<{ secret?: string; otpauthUrl?: string }>;
  verify2FA: (token: string) => Promise<void>;
  disable2FA: (token: string) => Promise<void>;
  send2FACode: () => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export const SecurityProvider = ({ children }: { children: React.ReactNode }) => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState<'2FA_APP' | 'SMS' | 'EMAIL' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setup2FA = async (method: '2FA_APP' | 'SMS' | 'EMAIL') => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/auth/2fa/setup', { method });
      setTwoFactorMethod(method);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to setup 2FA');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const verify2FA = async (token: string) => {
    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/2fa/verify', { token });
      setTwoFactorEnabled(true);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to verify 2FA');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const disable2FA = async (token: string) => {
    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/2fa/disable', { token });
      setTwoFactorEnabled(false);
      setTwoFactorMethod(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to disable 2FA');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const send2FACode = async () => {
    setIsLoading(true);
    try {
      await axiosInstance.post('/auth/2fa/send-code');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send 2FA code');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      await axiosInstance.put('/auth/password', { oldPassword, newPassword });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update password');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SecurityContext.Provider 
      value={{ 
        twoFactorEnabled,
        twoFactorMethod,
        isLoading,
        error,
        setup2FA,
        verify2FA,
        disable2FA,
        send2FACode,
        updatePassword
      }}
    >
      {children}
    </SecurityContext.Provider>
  );
};

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within a SecurityProvider');
  }
  return context;
}; 