import { Router } from 'express';
import userService from '../services/users';
import { getUser } from '../middleware/user';

const router = Router();

router.get('/me', getUser, async (req: any, res) => {
  try {
    const user = await userService.getCurrentUser(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/me', getUser, async (req: any, res) => {
  try {
    const user = await userService.updateUser(req.user.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/notification-preferences', getUser, async (req: any, res) => {
  try {
    const user = await userService.updateNotificationPreferences(req.user.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});
export default router; 