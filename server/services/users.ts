import prisma from "../db";
import { z } from "zod";

const updateUserSchema = z.object({
  name: z.string().optional(),
  avatar: z.string().optional(),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
    });

const updateNotificationPreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  pushNotifications: z.boolean().optional(),
  paymentReminders: z.boolean().optional(),
});

const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      status: true,
      phoneNumber: true,
      bio: true,
      country: true,
      timezone: true,
      language: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const updateUser = async (userId: string, data: any) => {
  const validated = updateUserSchema.parse(data);

  const user = await prisma.user.update({
    where: { id: userId },
    data: validated,
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      role: true,
      status: true,
      phoneNumber: true,
      bio: true,
      country: true,
      timezone: true,
      language: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};

const getUserProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      ownedSubscriptions: {
        include: {
          service: true,
          members: true,
        },
      },
      memberSubscriptions: {
        include: {
          subscription: {
            include: {
              service: true,
            },
          },
        },
      },
      reviews: {
        include: {
          subscription: true,
        },
      },
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

const updateNotificationPreferences = async (userId: string, data: any) => {
  const validated = updateNotificationPreferencesSchema.parse(data);
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      notificationPreferences: {
        upsert: {
          where: { userId },
          update: validated,
          create: validated,
        },
      },
    },
  });

  return user;

};

export default {
  getCurrentUser,
  updateUser,
  getUserProfile,
  updateNotificationPreferences,
}; 