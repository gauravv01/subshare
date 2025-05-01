import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../lib/axiosInstance';
interface Subscription {
  id: string;
  title: string;
  price: number;
  cycle: 'MONTHLY' | 'YEARLY' | 'QUARTERLY' | 'WEEKLY';
  maxMembers: number;
  description: string;
  serviceId: string;
  ownerId: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'INVITE_ONLY';
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  owner: {
    id: string;
    name: string;
    avatar: string;
    country: string;
    receivedReviews: Array<{
      rating: number;
    }>;
  };
  service: {
    id: string;
    name: string;
    logo: string;
    category: string;
  };
  members: Array<{
    id: string;
    userId: string;
    role: 'ADMIN' | 'MEMBER';
    user: {
      id: string;
      name: string;
      avatar: string;
    };
  }>;
}

interface SubscriptionContextType {
  subscriptions: Subscription[];
  ownedSubscriptions: Subscription[];
  memberSubscriptions: Subscription[];
  isLoading: boolean;
  error: string | null;
  fetchSubscriptions: () => Promise<void>;
  createSubscription: (data: {
    service: string;
    customService?: string;
    plan: string;
    customPlan?: string;
    totalSeats: number;
    pricePerSeat: number;
    billingCycle: string;
    accountEmail: string;
    accountPassword: string;
    profileAssignment: string;
  }) => Promise<void>;
  updateSubscription: (id: string, data: Partial<Subscription>) => Promise<void>;
  cancelSubscription: (id: string) => Promise<void>;
  inviteMember: (subscriptionId: string, email: string) => Promise<void>;
  removeMember: (subscriptionId: string, userId: string) => Promise<void>;
  joinSubscription: (subscriptionId: string) => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: React.ReactNode }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [ownedSubscriptions, setOwnedSubscriptions] = useState<Subscription[]>([]);
  const [memberSubscriptions, setMemberSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUserId = localStorage.getItem('userId');

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/subscriptions');
      setSubscriptions(response.data);
      setOwnedSubscriptions(response.data.filter((sub:any ) => sub.ownerId === currentUserId));
      setMemberSubscriptions(response.data.filter((sub:any) => sub.members.some((member:any) => member.userId === currentUserId)));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch subscriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (data: {
    service: string;
    customService?: string;
    plan: string;
    customPlan?: string;
    totalSeats: number;
    pricePerSeat: number;
    billingCycle: string;
    accountEmail: string;
    accountPassword: string;
    profileAssignment: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/subscriptions', {
        title: data.customService || data.service,
        serviceId: data.service === 'custom' ? null : data.service,
        planId: data.plan === 'custom' ? null : data.plan,
        customPlan: data.customPlan,
        maxMembers: data.totalSeats,
        price: data.pricePerSeat * data.totalSeats,
        cycle: data.billingCycle.toUpperCase(),
        visibility: "PUBLIC",
        accountCredentials: {
          email: data.accountEmail,
          password: data.accountPassword
        },
        profileAssignment: data.profileAssignment
      });
      
      setSubscriptions(prev => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create subscription');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateSubscription = async (id: string, data: Partial<Subscription>) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(`/subscriptions/${id}`, data);
      setSubscriptions(prev =>
        prev.map(sub => (sub.id === id ? response.data : sub))
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update subscription');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelSubscription = async (id: string) => {
    setIsLoading(true);
    try {
      await axiosInstance.post(`/subscriptions/${id}/cancel`);
      setSubscriptions(prev =>
        prev.map(sub =>
          sub.id === id ? { ...sub, status: 'CANCELLED' } : sub
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to cancel subscription');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const inviteMember = async (subscriptionId: string, email: string) => {
    setIsLoading(true);
    try {
      await axiosInstance.post(`/subscriptions/${subscriptionId}/invite`, { email });
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to invite member');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeMember = async (subscriptionId: string, userId: string) => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/subscriptions/${subscriptionId}/members/${userId}`);
      setSubscriptions(prev =>
        prev.map(sub =>
          sub.id === subscriptionId
            ? {
                ...sub,
                members: sub.members.filter(member => member.userId !== userId)
              }
            : sub
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to remove member');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const joinSubscription = async (subscriptionId: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/subscriptions/${subscriptionId}/join`);
      
      // Update local state
      await fetchSubscriptions(); // Refresh subscriptions to get the updated list
      
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to join subscription');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SubscriptionContext.Provider
      value={{
        subscriptions,
        ownedSubscriptions,
        memberSubscriptions,
        isLoading,
        error,
        fetchSubscriptions,
        createSubscription,
        updateSubscription,
        cancelSubscription,
        inviteMember,
        removeMember,
        joinSubscription,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptions must be used within a SubscriptionProvider');
  }
  return context;
}; 