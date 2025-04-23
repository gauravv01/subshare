import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../lib/axiosInstance';

interface ProfileContextType {
  profile: any;
  updateProfile: (profile: any) => Promise<void>;
  isLoading: boolean;
  error: string | null;
  fetchProfile: () => Promise<void>;
  
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);



  const fetchProfile = async () => {
    try {
      const response = await axiosInstance.get('/profile');
      setProfile(response.data);
    } catch (err) {
      setError('Failed to fetch profile');
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profile: any) => {
    try {
      const response = await axiosInstance.put('/profile', profile);
      setProfile(response.data);
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  return (
    <ProfileContext.Provider value={{ profile, updateProfile, isLoading, error, fetchProfile }}>
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
