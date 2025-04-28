import { Router } from 'express';
import messageService from '../services/messages';
import { getUser } from '../middleware/user';

const router = Router();

router.get('/', getUser, async (req: any, res) => {
  try {
    const messages = await messageService.getMessages(req.user.id);
    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/', getUser, async (req: any, res) => {
  try {
    const message = await messageService.sendMessage(
      req.user.id,
      req.body.receiverId,
      req.body.content,
      req.body.type || 'TEXT'
    );
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/:id/read', getUser, async (req: any, res) => {
  try {
    const message = await messageService.markAsRead(req.params.id, req.user.id);
    res.json(message);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router; 