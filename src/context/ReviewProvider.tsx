import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../lib/axiosInstance';

interface Review {
  id: string;
  rating: number;
  content: string;
  authorId: string;
  targetId: string;
  subscriptionId: string;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    name: string;
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
}

interface ReviewContextType {
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  fetchReviews: (subscriptionId: string) => Promise<void>;
  createReview: (data: {
    subscriptionId: string;
    rating: number;
    content?: string;
  }) => Promise<void>;
  updateReview: (reviewId: string, data: {
    rating?: number;
    content?: string;
  }) => Promise<void>;
  deleteReview: (reviewId: string) => Promise<void>;
  getUserReviews: (userId: string) => Promise<void>;
  getSubscriptionReviews: (subscriptionId: string) => Promise<void>;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const ReviewProvider = ({ children }: { children: React.ReactNode }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = async (subscriptionId: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/reviews/subscription/${subscriptionId}`);
      setReviews(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const createReview = async (data: {
    subscriptionId: string;
    rating: number;
    content?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/reviews/${data.subscriptionId}`, data);
      setReviews(prev => [...prev, response.data]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create review');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateReview = async (
    reviewId: string,
    data: { rating?: number; content?: string }
  ) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.put(`/reviews/${reviewId}`, data);
      setReviews(prev =>
        prev.map(review =>
          review.id === reviewId ? response.data : review
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update review');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteReview = async (reviewId: string) => {
    setIsLoading(true);
    try {
      await axiosInstance.delete(`/reviews/${reviewId}`);
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete review');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserReviews = async (userId: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/reviews/user/${userId}`);
      setReviews(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch user reviews');
    } finally {
      setIsLoading(false);
    }
  };

  const getSubscriptionReviews = async (subscriptionId: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/reviews/subscription/${subscriptionId}`);
      setReviews(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch subscription reviews');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ReviewContext.Provider
      value={{
        reviews,
        isLoading,
        error,
        fetchReviews,
        createReview,
        updateReview,
        deleteReview,
        getUserReviews,
        getSubscriptionReviews
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

export const useReviews = () => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error('useReviews must be used within a ReviewProvider');
  }
  return context;
}; 