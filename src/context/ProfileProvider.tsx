import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../lib/axiosInstance';

interface Profile {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  phoneNumber: string | null;
  bio: string | null;
  country: string | null;
  timezone: string | null;
  language: string;
  emailVerified: Date | null;
  phoneVerified: Date | null;
  twoFactorEnabled: boolean;
  twoFactorMethod: string | null;
  notificationPreferences: any;
  createdAt: Date;
  updatedAt: Date;
  emailNotifications: boolean;
  paymentReminders: boolean;
  newMemberAlerts: boolean;
  marketingEmails: boolean;
}

interface ProfileContextType {
  profile: Profile | null;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  updateNotificationPreferences: (preferences: any) => Promise<void>;
  notificationPreferences: any;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  updateOtherProfile: (id: string, data: Partial<Profile>) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [notificationPreferences, setNotificationPreferences] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/users/me');
      setProfile(response.data);
      
      // Also fetch notification preferences

    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (data: Partial<Profile>) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put('/users/me', data);
      setProfile(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateNotificationPreferences = async (preferences: any) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put('/users/notification-preferences', preferences);
      setNotificationPreferences(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update notification preferences');
      throw err;
    } finally {
      setIsLoading(false);
    }
    };

  const updatePassword = async (oldPassword: string, newPassword: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put('/auth/password', { oldPassword, newPassword });
      setProfile(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update password');
      throw err;
    } finally {
      setIsLoading(false);
    }
    };

  const updateOtherProfile = async (id: string, data: Partial<Profile>) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(`/profile/other-profile/${id}`, data);
      setProfile(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update other profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ProfileContext.Provider 
      value={{ 
        profile,
        isLoading,
        error,
        fetchProfile,
        updateProfile,
        updateNotificationPreferences,
        notificationPreferences,
        updatePassword,
        updateOtherProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
