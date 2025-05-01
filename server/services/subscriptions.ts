import prisma from "../db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { CycleType, Visibility } from "@prisma/client";
// Validation schema for creating a subscription
const createSubscriptionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  serviceId: z.string().nullable(),
  planId: z.string().nullable(),
  customPlan: z.string().optional(),
  maxMembers: z.number().min(2).max(6),
  price: z.number().positive(),
  cycle: z.nativeEnum(CycleType),
  description: z.string().optional(),
  visibility: z.nativeEnum(Visibility).optional().default("PUBLIC"),
  accountCredentials: z.object({
    email: z.string().email(),
    password: z.string().min(6),
  }),
  profileAssignment: z.string(),
});

// Create a new subscription
export const createSubscription = async (userId: string, data: any) => {
  // Validate input data
  const validated = createSubscriptionSchema.parse(data);
  
  // Hash the account password
  const hashedPassword = await bcrypt.hash(validated.accountCredentials.password, 10);
  
  // Create the subscription with credentials
  const subscription = await prisma.subscription.create({
    data: {
      title: validated.title,
      price: validated.price,
      cycle: validated.cycle,
      maxMembers: validated.maxMembers,
      description: validated.description,
      visibility: validated.visibility || "PUBLIC",
      profileAssignment: validated.profileAssignment || undefined,
      serviceId: validated.serviceId || undefined,
      ownerId: userId,
      accountCredentials: {
        create: {
          email: validated.accountCredentials.email,
          password: hashedPassword,
        },
      },
      // Add the owner as a member with ADMIN role
      members: {
        create: {
          userId: userId,
          role: "ADMIN",
          status: "ACTIVE",
        },
      },
    },
    include: {
      service: true,
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
  
  return subscription;
  };

// Get all subscriptions
export const getSubscriptions = async (userId: string) => {
  const subscriptions = await prisma.subscription.findMany({
    where: {
      OR: [
        { visibility: "PUBLIC" },
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
    include: {
      service: true,
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
  
  return subscriptions;
};

// Get subscription by ID
export const getSubscriptionById = async (id: string, userId: string) => {
  const subscription = await prisma.subscription.findFirst({
    where: {
      id,
      OR: [
        { visibility: "PUBLIC" },
        { ownerId: userId },
        { members: { some: { userId } } },
      ],
    },
    include: {
      service: true,
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            },
          },
        },
      },
    },
  });
  
  if (!subscription) {
    throw new Error("Subscription not found");
  }
  
  return subscription;
};

// Get services with plans
export const getServices = async () => {
  const services = await prisma.service.findMany({
    include: {
      plans: true,
    },
  });
  
  return services;
};

// Join subscription
export const joinSubscription = async (id: string, userId: string) => {
  const subscription = await prisma.subscription.update({
    where: { id },
    data: { members: { create: { userId, role: "MEMBER", status: "ACTIVE" } } },
  });
  return subscription;
};


export default {
  createSubscription,
  getSubscriptions,
  getSubscriptionById,
  getServices,
  joinSubscription,
}; 