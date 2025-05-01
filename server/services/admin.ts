import prisma from "../db";

export const getAdminDashboardStats = async (req: any, res: any) => {
    console.log("getAdminDashboardStats");
  const totalUsers = await prisma.user.count();
  const activeSubscriptions = await prisma.subscription.count({
    where: {
      status: "ACTIVE",
    },
  });
  const totalTransactions = await prisma.transaction.count();
  const platformFees = await prisma.transaction.aggregate({
    where: {
      status: "COMPLETED",
      type: "PAYMENT",
    },
    _sum: {
      amount: true
    }
  });

  const userGrowth = await prisma.user.aggregate({  
    
    where: {
      createdAt: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    },
    _count: true,

  });

  const subscriptionGrowth = await prisma.subscription.aggregate({
    where: {
      createdAt: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    },
    _count: true,
  });

  const transactionGrowth = await prisma.transaction.aggregate({
    where: {    
      createdAt: {
        gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      },
    },
    _count: true,
  });

  return res.json({
    totalUsers,
    activeSubscriptions,
    totalTransactions,
    platformFees,
    userGrowth,
    subscriptionGrowth,
    transactionGrowth,
  });
};

export const getRecentUsers = async (req: any, res: any) => {
    const recentUsers = await prisma.user.findMany({
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
    });
    return res.json(recentUsers);
};

export const getPopularServices = async (req: any, res: any) => {
    const popularServices = await prisma.service.findMany({
        orderBy: {
            createdAt: "desc",
        },
        take: 10,
    });
    return res.json(popularServices);
};

export const getServiceCounts = async (req: any, res: any) => {
    const serviceCounts = await prisma.service.count();
    return res.json(serviceCounts);
};

export const getUserCounts = async (req: any, res: any) => {
    const userCounts = await prisma.user.count();
    return res.json(userCounts);
};