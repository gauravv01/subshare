import React, { createContext, useContext, useState } from 'react';
import axiosInstance from '../lib/axiosInstance';

interface Service {
  id: string;
  name: string;
  description: string;
  website?: string;
  logo?: string;
  category: 'STREAMING' | 'GAMING' | 'PRODUCTIVITY' | 'EDUCATION' | 'MUSIC' | 'FITNESS' | 'OTHER';
  maxMembers?: number;
  termsUrl?: string;
  privacyUrl?: string;
  supportUrl?: string;
  features: string[];
  allowedCountries: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'REVIEW';
  featured: boolean;
  plans: Array<{
    id: string;
    name: string;
    price: number;
    cycle: string;
    features: string[];
    maxMembers: number;
  }>;
  accessFields?: Array<{
    id: string;
    name: string;
    description: string;
    required: boolean;
    type: string;
    placeholder?: string;
  }>;
}

interface ServiceContextType {
  services: Service[];
  selectedService: Service | null;
  isLoading: boolean;
  error: string | null;
  fetchServices: () => Promise<Service[]>;
  fetchService: (id: string) => Promise<Service>;
  searchServices: (query: string) => Promise<void>;
  filterServices: (category: string) => Promise<void>;
  addService: (service: Service) => Promise<void>;
  updateService: (service: Service) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addServicePlan: (serviceId: string, plan: any) => Promise<void>;
  updateServicePlan: (serviceId: string, planId: string, plan: any) => Promise<void>;
  deleteServicePlan: (serviceId: string, planId: string) => Promise<void>;
  updateServiceStatus: (id: string, status: string) => Promise<void>;
  updateServiceFeatured: (id: string, featured: boolean) => Promise<void>;
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
      const servicesData = response.data;
      setServices(servicesData);
      return servicesData;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch services');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchService = async (id: string) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`/services/${id}`);
      const serviceData = response.data;
      setSelectedService(serviceData);
      return serviceData;
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

  const addService = async (service: Service) => {
    const serviceToAdd = {
      ...service,
      website: service.website || "",
      logo: service.logo || "",
      termsUrl: service.termsUrl || "",
      privacyUrl: service.privacyUrl || "",
      supportUrl: service.supportUrl || "",
      maxMembers: service.maxMembers || 0
    };
    
    const response = await axiosInstance.post('/services', serviceToAdd);
    setServices([...services, response.data]);
  };
  

  const updateService = async (service: Service) => {
    const serviceToUpdate = {
      ...service,
      website: service.website || "",
      logo: service.logo || "",
      termsUrl: service.termsUrl || "",
      privacyUrl: service.privacyUrl || "",
      supportUrl: service.supportUrl || "",
      maxMembers: service.maxMembers || 0
    };
    
    const response = await axiosInstance.put(`/services/${service.id}`, serviceToUpdate);
    setServices(services.map(s => s.id === service.id ? response.data : s));
  };

  const deleteService = async (id: string) => {
    const response = await axiosInstance.delete(`/services/${id}`);
    setServices(services.filter(s => s.id !== id));
  };

  const addServicePlan = async (serviceId: string, plan: any) => {
    const response = await axiosInstance.post(`/services/${serviceId}/plans`, plan);
    setSelectedService(prev => prev ? { ...prev, plans: [...prev.plans, response.data] } : null);
  };

  const updateServicePlan = async (serviceId: string, planId: string, plan: any) => {
    const response = await axiosInstance.put(`/services/${serviceId}/plans/${planId}`, plan);
    setSelectedService(prev => prev ? { ...prev, plans: prev.plans.map(p => p.id === planId ? response.data : p) } : null);
  };
  
  
  const deleteServicePlan = async (serviceId: string, planId: string) => {
    const response = await axiosInstance.delete(`/services/${serviceId}/plans/${planId}`);
    setSelectedService(prev => prev ? { ...prev, plans: prev.plans.filter(p => p.id !== planId) } : null);
  };

  const updateServiceStatus = async (id: string, status: string) => {
    const response = await axiosInstance.put(`/services/${id}/status`, { status });
    setServices(services.map(s => s.id === id ? response.data : s));
  };

  const updateServiceFeatured = async (id: string, featured: boolean) => {
    const response = await axiosInstance.put(`/services/${id}/featured`, { featured });
    setServices(services.map(s => s.id === id ? response.data : s));
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
        filterServices,
        addService,
        updateService,
        deleteService,
        addServicePlan,
        updateServicePlan,
        deleteServicePlan,
        updateServiceStatus,
        updateServiceFeatured
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