import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../lib/axiosInstance';

interface BankContextType {
  bankDetails: any;
  isLoading: boolean;
  error: string | null;
  fetchBankDetails: () => Promise<void>;
  updateBankDetails: (bankDetails: any) => Promise<void>;
  deleteBankDetails: () => Promise<void>;
  createBankDetails: (bankDetails: any) => Promise<void>;
  fetchWithdrawalMethods: () => Promise<void>;
  updateWithdrawalMethod: (withdrawalMethod: any) => Promise<void>;
  createWithdrawalMethod: (withdrawalMethod: any) => Promise<void>;
  withdrawalMethods: any;
}

const BankContext = createContext<BankContextType | undefined>(undefined);

export const BankProvider = ({ children }: { children: React.ReactNode }) => {
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  
  const [withdrawalMethods, setWithdrawalMethods] = useState<any>([]);


  
  const fetchBankDetails = async () => {
    try {
      const response = await axiosInstance.get('/bankDetails');
      setBankDetails(response.data);
    } catch (err) {
      setError('Failed to fetch bank details');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBankDetails = async (bankDetails: any) => {
    try {
      const response = await axiosInstance.put('/bankDetails', bankDetails);
      setBankDetails(response.data);
    } catch (err) {
      setError('Failed to update bank details');
    }
  };

  const deleteBankDetails = async () => {
    try {
      await axiosInstance.delete('/bankDetails');
    } catch (err) {
      setError('Failed to delete bank details');
    }
  };

  const createBankDetails = async (bankDetails: any) => {
    try {
      const response = await axiosInstance.post('/bankDetails', bankDetails);
      setBankDetails(response.data);
    } catch (err) {
      setError('Failed to create bank details');
    }
  };

  const fetchWithdrawalMethods = async () => {
    try {
      const response = await axiosInstance.get('/bankDetails/withdrawalMethods');
      setWithdrawalMethods(response.data);
    } catch (err) {
      setError('Failed to fetch withdrawal methods');   
    } finally {
      setIsLoading(false);
    }
  };

  const updateWithdrawalMethod = async (withdrawalMethod: any) => {
    try {
      const response = await axiosInstance.put('/bankDetails/withdrawalMethod', withdrawalMethod);
      setWithdrawalMethods(response.data);
    } catch (err) {
      setError('Failed to update withdrawal method');
    }
  };

  const createWithdrawalMethod = async (withdrawalMethod: any) => {
    try {
      const response = await axiosInstance.post('/bankDetails/withdrawalMethod', withdrawalMethod);
      setWithdrawalMethods(response.data);
    } catch (err) {
      setError('Failed to create withdrawal method');
    }
  };
  

  return (
    <BankContext.Provider value={{ bankDetails, isLoading, error, fetchBankDetails, updateBankDetails, deleteBankDetails, createBankDetails, fetchWithdrawalMethods, updateWithdrawalMethod, createWithdrawalMethod ,withdrawalMethods}}>
      {children}
    </BankContext.Provider>
  );
};

export const useBank = () => {
  const context     = useContext(BankContext);
  if (!context) {
    throw new Error('useBank must be used within a BankProvider');
  }
  return context;
};