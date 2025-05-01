import prisma from "../db";
import { z } from "zod";
import  {ServiceStatus} from "@prisma/client";  

const serviceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  website: z.string().url().optional(),
  logo: z.string().optional(),
  category: z.enum(['STREAMING', 'GAMING', 'PRODUCTIVITY', 'EDUCATION', 'MUSIC', 'FITNESS', 'OTHER']),
  maxMembers: z.number().optional(),
  termsUrl: z.string().url().optional(),
  privacyUrl: z.string().url().optional(),
  supportUrl: z.string().url().optional(),
  features: z.array(z.string()).optional(),
  allowedCountries: z.array(z.string()).optional(),
});

const servicePlanSchema = z.object({
  name: z.string(),
  price: z.number(),
  cycle: z.enum(['MONTHLY', 'YEARLY', 'QUARTERLY', 'WEEKLY']),
  features: z.array(z.string()).optional(),
  maxMembers: z.number().optional(),
});

const getServices = async () => {
  const services = await prisma.service.findMany({
    include: {
      plans: true,
    },
  });
  return services;
};

const getService = async (id: string) => {
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      plans: true,
      subscriptions: {
        where: {
          visibility: 'PUBLIC',
          status: 'ACTIVE',
        },
        include: {
          members: true,
        },
      },
    },
  });

  if (!service) {
    throw new Error('Service not found');
  }

  return service;
};

const createService = async (data: any) => {
  const validated = serviceSchema.parse(data);

  const service = await prisma.service.create({
    data: validated,
    include: {
      plans: true,
    },
  });

  return service;
};

const updateService = async (id: string, data: any) => {
  const validated = serviceSchema.partial().parse(data);

  const service = await prisma.service.update({
    where: { id },
    data: validated,
    include: {
      plans: true,
    },
  });

  return service;
};

const deleteService = async (id: string) => {
  const service = await prisma.service.delete({
    where: { id },
  });
  return service;
};

const addServicePlan = async (serviceId: string, data: any) => {
  const validated = servicePlanSchema.parse(data);

  const service = await prisma.service.update({
    where: { id: serviceId }, 
    data: {
      plans: {
        create: validated,
      },
    },
    include: {
      plans: true,
    },
  });

  return service;
};

const updateServicePlan = async (serviceId: string, planId: string, data: any) => {
  const validated = servicePlanSchema.partial().parse(data);

  const service = await prisma.service.update({
    where: { id: serviceId, plans: { some: { id: planId } } },
    data: {
      plans: {
        update: {
          where: { id: planId },
          data: validated,
        },
      },
    },
    include: {
      plans: true,
    },
  });

  return service;
};

const deleteServicePlan = async (serviceId: string, planId: string) => {
  const service = await prisma.service.update({
    where: { id: serviceId, plans: { some: { id: planId } } },
    data: {
      plans: {
        delete: {
          id: planId,
        },
      },
    },
    include: {
      plans: true,
    },
  });

  return service;
};

const updateServiceStatus = async (id: string, status: ServiceStatus) => {
  const service = await prisma.service.update({
    where: { id },  
    data: {
      status: status as ServiceStatus,
    },
  });

  return service;
};

const updateServiceFeatured = async (id: string, featured: boolean) => {
  const service = await prisma.service.update({
    where: { id },
    data: {
      featured,
    },
  });
  
  return service;
};

export default {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  addServicePlan,
  updateServicePlan,
  deleteServicePlan,
  updateServiceStatus,
  updateServiceFeatured
}; 