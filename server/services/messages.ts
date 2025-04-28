import prisma from "../db";
import { z } from "zod";

const messageSchema = z.object({
  content: z.string(),
  type: z.enum(['TEXT', 'SYSTEM', 'PAYMENT_REQUEST', 'SUBSCRIPTION_INVITE']).default('TEXT'),
  attachments: z.array(z.string()).optional(),
});

const getMessages = async (userId: string) => {
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId },
      ],
    },
    include: {
      sender: {
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
        },
      },
      receiver: {
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return messages;
};

const sendMessage = async (
  senderId: string,
  receiverId: string,
  content: string,
  type: 'TEXT' | 'SYSTEM' | 'PAYMENT_REQUEST' | 'SUBSCRIPTION_INVITE' = 'TEXT',
  attachments: string[] = []
) => {
  const validated = messageSchema.parse({ content, type, attachments });

  const message = await prisma.message.create({
    data: {
      senderId,
      receiverId,
      ...validated,
    },
    include: {
      sender: {
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
        },
      },
      receiver: {
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  return message;
};

const markAsRead = async (messageId: string, userId: string) => {
  const message = await prisma.message.findFirst({
    where: {
      id: messageId,
      receiverId: userId,
    },
  });

  if (!message) {
    throw new Error('Message not found');
  }

  const updatedMessage = await prisma.message.update({
    where: { id: messageId },
    data: {
      read: true,
      readAt: new Date(),
    },
  });

  return updatedMessage;
};

export default {
  getMessages,
  sendMessage,
  markAsRead,
}; 