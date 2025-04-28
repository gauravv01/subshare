import prisma from "../db";
import { z } from "zod";

const paymentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  subscriptionId: z.string(),
  paymentMethodId: z.string(),
});

const getTransactions = async (userId: string) => {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    include: {
      subscription: true,
      paymentMethod: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return transactions;
};

const createPayment = async (userId: string, data: {
  amount: number;
  currency?: string;
  subscriptionId: string;
  paymentMethodId: string;
}) => {
  const validated = paymentSchema.parse(data);

  const transaction = await prisma.transaction.create({
    data: {
      ...validated,
      userId,
      type: 'PAYMENT',
      status: 'COMPLETED',
      processedAt: new Date(),
    },
    include: {
      subscription: true,
      paymentMethod: true,
    },
  });

  return transaction;
};

const createRefund = async (transactionId: string, userId: string) => {
  const originalTransaction = await prisma.transaction.findFirst({
    where: {
      id: transactionId,
      userId,
      type: 'PAYMENT',
      status: 'COMPLETED',
    },
  });

  if (!originalTransaction) {
    throw new Error('Original transaction not found');
  }

  const refund = await prisma.transaction.create({
    data: {
      amount: originalTransaction.amount,
      currency: originalTransaction.currency,
      userId,
      subscriptionId: originalTransaction.subscriptionId,
      paymentMethodId: originalTransaction.paymentMethodId,
      type: 'REFUND',
      status: 'COMPLETED',
      processedAt: new Date(),
    },
    include: {
      subscription: true,
      paymentMethod: true,
    },
  });

  return refund;
};

export default {
  getTransactions,
  createPayment,
  createRefund,
}; 