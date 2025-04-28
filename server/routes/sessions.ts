import { Router } from 'express';
import sessionService from '../services/sessions';
import { getUser } from '../middleware/user';

const router = Router();

router.get('/', getUser, async (req: any, res) => {
  try {
    const sessions = await sessionService.getSessions(req.user.id);
    res.json(sessions);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/:sessionId', getUser, async (req: any, res) => {
  try {
    const result = await sessionService.terminateSession(
      req.params.sessionId,
      req.user.id
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/terminate-all', getUser, async (req: any, res) => {
  try {
    const result = await sessionService.terminateAllOtherSessions(
      req.user.id,
      req.session.id // Assuming you store the current session ID in req.session
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router; 