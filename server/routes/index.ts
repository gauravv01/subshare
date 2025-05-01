import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import subscriptionRoutes from './subscriptions';
import serviceRoutes from './services';
import membershipRoutes from './memberships';
import notificationRoutes from './notifications';
import messageRoutes from './messages';
import reviewRoutes from './reviews';
import transactionRoutes from './transactions';
import sessionRoutes from './sessions';
import bankRoutes from './bankDetails';
import profileRoutes from './profile';
import adminRoutes from './admin';




const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/subscriptions', subscriptionRoutes);
router.use('/services', serviceRoutes);
router.use('/memberships', membershipRoutes);
router.use('/notifications', notificationRoutes);
router.use('/messages', messageRoutes);
router.use('/reviews', reviewRoutes);
router.use('/transactions', transactionRoutes);
router.use('/sessions', sessionRoutes);
router.use('/bankDetails', bankRoutes);
router.use('/profile', profileRoutes);
router.use('/admin', adminRoutes);

export default router;
