import prisma from "../db";
import { z } from "zod";
import { NotificationType } from '../types';

const getNotifications = async (userId: string) => {
  const notifications = await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return notifications;
};

const markAsRead = async (notificationId: string, userId: string) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      userId,
    },
  });

  if (!notification) {
    throw new Error('Notification not found');
  }

  const updatedNotification = await prisma.notification.update({
    where: { id: notificationId },
    data: {
      read: true,
      readAt: new Date(),
    },
  });

  return updatedNotification;
};

const markAllAsRead = async (userId: string) => {
  await prisma.notification.updateMany({
    where: {
      userId,
      read: false,
    },
    data: {
      read: true,
      readAt: new Date(),
    },
  });
};

const createNotification = async (data: {
  userId: string;
  type: NotificationType;
  content: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}) => {
  const notification = await prisma.notification.create({
    data: {
      ...data,
      metadata: data.metadata ? data.metadata as any : undefined,
    },
  });

  return notification;
};

export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
}; 