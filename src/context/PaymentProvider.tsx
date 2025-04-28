import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../lib/axiosInstance';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  type: 'PAYMENT' | 'REFUND' | 'PAYOUT';
  createdAt: Date;
  processedAt: Date | null;
  subscription?: {
    id: string;
    title: string;
  };
  paymentMethod?: {
    id: string;
    type: string;
    lastFour?: string;
  };
}

interface PaymentContextType {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  createPayment: (data: {
    amount: number;
    currency?: string;
    subscriptionId: string;
    paymentMethodId: string;
  }) => Promise<void>;
  requestRefund: (transactionId: string) => Promise<void>;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider = ({ children }: { children: React.ReactNode }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/transactions');
      setTransactions(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const createPayment = async (data: {
    amount: number;
    currency?: string;
    subscriptionId: string;
    paymentMethodId: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/transactions/payment', data);
      setTransactions(prev => [response.data, ...prev]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to process payment');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const requestRefund = async (transactionId: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post(`/transactions/refund/${transactionId}`);
      setTransactions(prev =>
        prev.map(transaction =>
          transaction.id === transactionId
            ? { ...transaction, status: 'REFUNDED' }
            : transaction
        )
      );
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to request refund');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PaymentContext.Provider
      value={{
        transactions,
        isLoading,
        error,
        fetchTransactions,
        createPayment,
        requestRefund
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayments = () => {
  const context = useContext(PaymentContext);
  if (!context) {
    throw new Error('usePayments must be used within a PaymentProvider');
  }
  return context;
}; 