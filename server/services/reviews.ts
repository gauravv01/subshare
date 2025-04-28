import prisma from "../db";
import { z } from "zod";

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().optional(),
});

const createReview = async (
  authorId: string,
  subscriptionId: string,
  data: { rating: number; content?: string }
) => {
  const validated = reviewSchema.parse(data);

  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: { members: true },
  });

  if (!subscription) {
    throw new Error('Subscription not found');
  }

  // Check if user is a member of the subscription
  const isMember = subscription.members.some(member => member.userId === authorId);
  if (!isMember) {
    throw new Error('Only members can review subscriptions');
  }

  const review = await prisma.review.create({
    data: {
      ...validated,
      authorId,
      subscriptionId,
      targetId: subscription.ownerId,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  return review;
};

const getSubscriptionReviews = async (subscriptionId: string) => {
  const reviews = await prisma.review.findMany({
    where: { subscriptionId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return reviews;
};

const getUserReviews = async (userId: string) => {
  const reviews = await prisma.review.findMany({
    where: { targetId: userId },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
      subscription: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return reviews;
};

export default {
  createReview,
  getSubscriptionReviews,
  getUserReviews,
}; 