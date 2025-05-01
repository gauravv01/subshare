import prisma from "../db";
import { z } from "zod";
import  {ServiceStatus} from "@prisma/client";  

const serviceSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  website: z.union([z.string().url(), z.literal("")]).optional(),
  logo: z.string().optional(),
  category: z.enum(['STREAMING', 'GAMING', 'PRODUCTIVITY', 'EDUCATION', 'MUSIC', 'FITNESS', 'OTHER']),
  maxMembers: z.number().optional(),
  termsUrl: z.union([z.string().url(), z.literal("")]).optional(),
  privacyUrl: z.union([z.string().url(), z.literal("")]).optional(),
  supportUrl: z.union([z.string().url(), z.literal("")]).optional(),
  // Remove these if they don't exist in your schema
  features: z.array(z.string()).optional(),
  allowedCountries: z.array(z.string()).optional(),
});

const accessFieldSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  required: z.boolean(),
  type: z.enum(['TEXT', 'NUMBER', 'EMAIL', 'URL', 'DATE', 'TIME', 'BOOLEAN']),
  placeholder: z.string().optional(),
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
      accessFields: true,
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
    data: {
      ...validated,
      // Don't include features and allowedCountries if they don't exist in your schema
    },
    include: {
      plans: true,
    },
  });

  return service;
};

const updateService = async (id: string, data: any) => {
  const validated = serviceSchema.partial().parse(data);
  
  // Extract only the fields that exist in the Prisma schema
  const { 
    name, 
    description, 
    website, 
    logo, 
    category, 
    maxMembers,
    termsUrl,
    privacyUrl,
    supportUrl,
    // Remove features and allowedCountries if they don't exist in your schema
    // features,
    // allowedCountries
  } = validated;

  const service = await prisma.service.update({
    where: { id },
    data: {
      name,
      description,
      website,
      logo,
      category,
      maxMembers,
      termsUrl,
      privacyUrl,
      supportUrl,
      // Don't include features and allowedCountries if they don't exist in your schema
    },
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

const addAccessField = async (serviceId: string, data: any) => {
  const validated = accessFieldSchema.parse(data);
  const service = await prisma.service.update({
    where: { id: serviceId },
    data: {
      accessFields: {
        create: validated,
      },
    },
    include: {
      accessFields: true,
    },
  });
  
  return service;
};  

const updateAccessField = async (serviceId: string, fieldId: string, data: any) => {
  const validated = accessFieldSchema.partial().parse(data);
  const service = await prisma.service.update({
    where: { id: serviceId, accessFields: { some: { id: fieldId } } },
    data: {
      accessFields: {
        update: {
          where: { id: fieldId },
          data: validated,
        },
      },
    },
    include: {
      accessFields: true,
    },
  });
  
  return service;
};

const deleteAccessField = async (serviceId: string, fieldId: string) => {
  const service = await prisma.service.update({
    where: { id: serviceId, accessFields: { some: { id: fieldId } } },
    data: {
      accessFields: {
        delete: {
          id: fieldId,

        },

      },
    },
  });

  return service;
};

const getAccessFields = async (serviceId: string) => {
  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { accessFields: true },
  });
  return service?.accessFields;
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
  updateServiceFeatured,
  addAccessField,
  updateAccessField,
  deleteAccessField,
  getAccessFields,
}; 