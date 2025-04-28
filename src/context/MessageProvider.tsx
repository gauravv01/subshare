import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../lib/axiosInstance';

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  type: 'TEXT' | 'SYSTEM' | 'PAYMENT_REQUEST' | 'SUBSCRIPTION_INVITE';
  read: boolean;
  readAt: Date | null;
  createdAt: Date;
  attachments: string[];
  sender: {
    id: string;
    name: string;
    avatar: string;
  };
  receiver: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface MessageContextType {
  messages: Message[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  fetchMessages: () => Promise<void>;
  sendMessage: (receiverId: string, content: string, type?: string) => Promise<void>;
  markAsRead: (messageId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  sendPaymentRequest: (receiverId: string, amount: number, description: string) => Promise<void>;
  sendSubscriptionInvite: (receiverId: string, subscriptionId: string) => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = messages.filter(m => !m.read).length;

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/messages');
      setMessages(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (receiverId: string, content: string, type: string = 'TEXT') => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/messages', {
        receiverId,
        content,
        type
      });
      setMessages(prev => [response.data, ...prev]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send message');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await axiosInstance.put(`/messages/${messageId}/read`);
      setMessages(prev =>
        prev.map(message =>
          message.id === messageId
            ? { ...message, read: true, readAt: new Date() }
            : message
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to mark message as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosInstance.put('/messages/read-all');
      setMessages(prev =>
        prev.map(message => ({
          ...message,
          read: true,
          readAt: new Date()
        }))
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to mark all messages as read');
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await axiosInstance.delete(`/messages/${messageId}`);
      setMessages(prev => prev.filter(message => message.id !== messageId));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete message');
      throw err;
    }
  };

  const sendPaymentRequest = async (receiverId: string, amount: number, description: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/messages/payment-request', {
        receiverId,
        amount,
        description
      });
      setMessages(prev => [response.data, ...prev]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send payment request');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const sendSubscriptionInvite = async (receiverId: string, subscriptionId: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/messages/subscription-invite', {
        receiverId,
        subscriptionId
      });
      setMessages(prev => [response.data, ...prev]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to send subscription invite');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MessageContext.Provider
      value={{
        messages,
        unreadCount,
        isLoading,
        error,
        fetchMessages,
        sendMessage,
        markAsRead,
        markAllAsRead,
        deleteMessage,
        sendPaymentRequest,
        sendSubscriptionInvite
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export const useMessages = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within a MessageProvider');
  }
  return context;
}; 