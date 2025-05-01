import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../lib/axiosInstance';

interface Member {
  id: string;
  userId: string;
  subscriptionId: string;
  role: 'ADMIN' | 'MEMBER';
  joinedAt: Date;
  status: 'ACTIVE' | 'PENDING' | 'BLOCKED';
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  subscription: {
    id: string;
    title: string;
    service: {
      id: string;
      name: string;
      logo: string;
    };
  };
  accessProfile: string;
  nextPaymentDate?: string;
}

interface MemberContextType {
  members: Member[];
  isLoading: boolean;
  error: string | null;
  fetchMembers: (subscriptionId: string) => Promise<void>;
  updateMemberRole: (subscriptionId: string, userId: string, role: 'ADMIN' | 'MEMBER') => Promise<void>;
  removeMember: (subscriptionId: string, userId: string) => Promise<void>;
  acceptInvitation: (invitationId: string) => Promise<void>;
  rejectInvitation: (invitationId: string) => Promise<void>;
  blockMember: (subscriptionId: string, userId: string) => Promise<void>;
  unblockMember: (subscriptionId: string, userId: string) => Promise<void>;
}

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export const MemberProvider = ({ children }: { children: React.ReactNode }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = async (subscriptionId: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/memberships/${subscriptionId}/members`);
      setMembers(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch members');
    } finally {
      setIsLoading(false);
    }
  };

  const updateMemberRole = async (subscriptionId: string, userId: string, role: 'ADMIN' | 'MEMBER') => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(`/memberships/${subscriptionId}/members/${userId}`, { role });
      setMembers(prev =>
        prev.map(member =>
          member.userId === userId ? { ...member, role } : member
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update member role');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeMember = async (subscriptionId: string, userId: string) => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/memberships/${subscriptionId}/members/${userId}`);
      setMembers(prev => prev.filter(member => member.userId !== userId));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to remove member');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const acceptInvitation = async (invitationId: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/memberships/invitations/${invitationId}/accept`);
      setMembers(prev => [...prev, response.data]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to accept invitation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const rejectInvitation = async (invitationId: string) => {
    setIsLoading(true);
    try {
      await axiosInstance.post(`/memberships/invitations/${invitationId}/reject`);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to reject invitation');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const blockMember = async (subscriptionId: string, userId: string) => {
    setIsLoading(true);
    try {
      await axiosInstance.post(`/memberships/${subscriptionId}/members/${userId}/block`);
      setMembers(prev =>
        prev.map(member =>
          member.userId === userId ? { ...member, status: 'BLOCKED' } : member
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to block member');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const unblockMember = async (subscriptionId: string, userId: string) => {
    setIsLoading(true);
    try {
      await axiosInstance.post(`/memberships/${subscriptionId}/members/${userId}/unblock`);
      setMembers(prev =>
        prev.map(member =>
          member.userId === userId ? { ...member, status: 'ACTIVE' } : member
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to unblock member');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MemberContext.Provider
      value={{
        members,
        isLoading,
        error,
        fetchMembers,
        updateMemberRole,
        removeMember,
        acceptInvitation,
        rejectInvitation,
        blockMember,
        unblockMember
      }}
    >
      {children}
    </MemberContext.Provider>
  );
};

export const useMembers = () => {
  const context = useContext(MemberContext);
  if (!context) {
    throw new Error('useMembers must be used within a MemberProvider');
  }
  return context;
}; 