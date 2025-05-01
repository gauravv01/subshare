import prisma from "../db";
import { z } from "zod";

const paymentSchema = z.object({
  amount: z.number().positive(),
  userId: z.string(),
  subscriptionId: z.string(),
  paymentMethodId: z.string().optional(),
  description: z.string().optional(),
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

const getMemberTransactions = async (memberId: string) => {
  const transactions = await prisma.$queryRaw`
    SELECT * FROM "Transaction" 
    WHERE "memberId" = ${memberId}
    ORDER BY "createdAt" DESC
  `;
  
  return transactions;
};

const createPayment = async (data: {
  amount: number;
  userId: string;
  subscriptionId: string;
  paymentMethodId?: string;
  description?: string;
}) => {
  const validated = paymentSchema.parse(data);
  
  // Create transaction data with required fields
  const transactionData: any = {
    amount: validated.amount,
    type: 'PAYMENT',
    status: 'COMPLETED',
    description: validated.description || 'Subscription payment',
    user: { connect: { id: validated.userId } },
    subscription: { connect: { id: validated.subscriptionId } },
  };
  
  // Add payment method if provided
  if (validated.paymentMethodId) {
    // For default payment methods, don't try to connect to database
    if (['credit-card', 'paypal', 'bank-transfer'].includes(validated.paymentMethodId)) {
      // Just store the payment method type
      transactionData.paymentMethodType = validated.paymentMethodId;
    } else {
      // Connect to an actual payment method in the database
      transactionData.paymentMethod = { connect: { id: validated.paymentMethodId } };
    }
  }
  
  const transaction = await prisma.transaction.create({
    data: transactionData,
    include: {
      subscription: true,
      paymentMethod: true,
    } as any
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
  getMemberTransactions,
  createPayment,
  createRefund,
}; 