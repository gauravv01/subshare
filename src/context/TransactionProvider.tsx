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
    service: {
      id: string;
      name: string;
      logo: string;
    };
  };
  paymentMethod?: {
    id: string;
    type: string;
    provider: string;
    lastFour?: string;
  };
}

interface TransactionContextType {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  fetchTransactions: () => Promise<void>;
  getTransactionById: (id: string) => Promise<Transaction>;
  createPayment: (data: {
    amount: number;
    userId: string;
    subscriptionId: string;
    paymentMethodId?: string;
    description?: string;
  }) => Promise<any>;
  requestRefund: (transactionId: string) => Promise<void>;
  downloadInvoice: (transactionId: string) => Promise<void>;
  filterTransactions: (filters: {
    type?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider = ({ children }: { children: React.ReactNode }) => {
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

  const getTransactionById = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/transactions/${id}`);
      return response.data;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch transaction');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const createPayment = async (data: {
    amount: number;
    userId: string;
    subscriptionId: string;
    paymentMethodId?: string;
    description?: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/transactions/payment', data);
      setTransactions(prev => [response.data, ...prev]);
      return response.data;
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
      const response = await axiosInstance.post(`/transactions/${transactionId}/refund`);
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

  const downloadInvoice = async (transactionId: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/transactions/${transactionId}/invoice`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${transactionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to download invoice');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const filterTransactions = async (filters: {
    type?: string;
    status?: string;
    startDate?: Date;
    endDate?: Date;
  }) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
      if (filters.endDate) params.append('endDate', filters.endDate.toISOString());

      const response = await axiosInstance.get(`/transactions?${params.toString()}`);
      setTransactions(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to filter transactions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        isLoading,
        error,
        fetchTransactions,
        getTransactionById,
        createPayment,
        requestRefund,
        downloadInvoice,
        filterTransactions
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}; 