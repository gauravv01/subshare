import prisma from "../db";
import { z } from "zod";

const joinSubscription = async (subscriptionId: string, userId: string) => {
  // Check if subscription exists and has space
  const subscription = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
    include: {
      members: true,
    },
  });

  if (!subscription) {
    throw new Error('Subscription not found');
  }

  if (subscription.maxMembers && subscription.members.length >= subscription.maxMembers) {
    throw new Error('Subscription is full');
  }

  // Check if user is already a member
  const existingMembership = await prisma.membership.findUnique({
    where: {
      userId_subscriptionId: {
        userId,
        subscriptionId,
      },
    },
  });

  if (existingMembership) {
    throw new Error('Already a member of this subscription');
  }

  // Create membership
  const membership = await prisma.membership.create({
    data: {
      userId,
      subscriptionId,
      role: 'MEMBER',
      status: 'ACTIVE',
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
        },
      },
      subscription: true,
    },
  });

  return membership;
};

const leaveSubscription = async (subscriptionId: string, userId: string) => {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_subscriptionId: {
        userId,
        subscriptionId,
      },
    },
  });

  if (!membership) {
    throw new Error('Not a member of this subscription');
  }

  await prisma.membership.delete({
    where: {
      userId_subscriptionId: {
        userId,
        subscriptionId,
      },
    },
  });
};

const updateMemberRole = async (
  subscriptionId: string,
  targetUserId: string,
  newRole: 'ADMIN' | 'MEMBER',
  requestingUserId: string
) => {
  // Check if requesting user is owner or admin
  const requestingUserMembership = await prisma.membership.findUnique({
    where: {
      userId_subscriptionId: {
        userId: requestingUserId,
        subscriptionId,
      },
    },
  });

  if (!requestingUserMembership || requestingUserMembership.role === 'MEMBER') {
    throw new Error('Unauthorized to update member roles');
  }

  const updatedMembership = await prisma.membership.update({
    where: {
      userId_subscriptionId: {
        userId: targetUserId,
        subscriptionId,
      },
    },
    data: {
      role: newRole,
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  return updatedMembership;
};

const getMembers = async (subscriptionId: string) => {
  const members = await prisma.membership.findMany({
    where: {
      subscriptionId,
    },
  });
  return members;
};


export default {
  joinSubscription,
  leaveSubscription,
  updateMemberRole,
  getMembers,
}; 