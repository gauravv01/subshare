import { Router } from 'express';
import authRoutes from './auth';
import profileRoutes from './profile';
import bankDetailsRoutes from './bankDetails';

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/bankDetails', bankDetailsRoutes);


export default router;
