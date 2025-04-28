import { Router } from 'express';
import notificationService from '../services/notifications';
import { getUser } from '../middleware/user';

const router = Router();

router.get('/', getUser, async (req: any, res) => {
  try {
    const notifications = await notificationService.getNotifications(req.user.id);
    res.json(notifications);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/:id/read', getUser, async (req: any, res) => {
  try {
    const notification = await notificationService.markAsRead(req.params.id, req.user.id);
    res.json(notification);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/read-all', getUser, async (req: any, res) => {
  try {
    await notificationService.markAllAsRead(req.user.id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router; 