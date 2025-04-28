import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../lib/axiosInstance';

interface Service {
  id: string;
  name: string;
  description: string;
  website: string;
  logo: string;
  category: 'STREAMING' | 'GAMING' | 'PRODUCTIVITY' | 'EDUCATION' | 'MUSIC' | 'FITNESS' | 'OTHER';
  maxMembers: number;
  termsUrl: string;
  privacyUrl: string;
  supportUrl: string;
  features: string[];
  allowedCountries: string[];
  plans: Array<{
    id: string;
    name: string;
    price: number;
    cycle: string;
    features: string[];
    maxMembers: number;
  }>;
}

interface ServiceContextType {
  services: Service[];
  selectedService: Service | null;
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  fetchService: (id: string) => Promise<void>;
  searchServices: (query: string) => Promise<void>;
  filterServices: (category: string) => Promise<void>;
}

const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

export const ServiceProvider = ({ children }: { children: React.ReactNode }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/services');
      setServices(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch services');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchService = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/services/${id}`);
      setSelectedService(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch service');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const searchServices = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/services/search?q=${query}`);
      setServices(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to search services');
    } finally {
      setIsLoading(false);
    }
  };

  const filterServices = async (category: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/services?category=${category}`);
      setServices(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to filter services');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ServiceContext.Provider
      value={{
        services,
        selectedService,
        isLoading,
        error,
        fetchServices,
        fetchService,
        searchServices,
        filterServices
      }}
    >
      {children}
    </ServiceContext.Provider>
  );
};

export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
}; 