import prisma from "../db";
import { z } from "zod";

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

export default {
  getServices,
  getService,
  createService,
  updateService,
}; 