import { Router, Request, Response } from 'express';
import { signup, login, updatePassword, setup2FA, verify2FA, disable2FA, send2FACode } from '../services/auth';
import { getUser } from '../middleware/user';

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const { email, password, name } = req.body;
  try {
    const { user, token } = await signup(email, password, name, req.headers['user-agent'] || '', req.ip || '');
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await login(email, password, req.headers['user-agent'] || '', req.ip || '');
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/2fa/setup', getUser, async (req: any, res) => {
  try {
    const { method } = req.body;
    const result = await setup2FA(req.user.id, method);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/2fa/verify', getUser, async (req: any, res) => {
  try {
    const { token } = req.body;
    const result = await verify2FA(req.user.id, token);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/2fa/disable', getUser, async (req: any, res) => {
  try {
    const { token } = req.body;
    const result = await disable2FA(req.user.id, token);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/2fa/send-code', getUser, async (req: any, res) => {
  try {
    const result = await send2FACode(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/password', getUser, async (req: any, res) => {
  try {
    const result = await updatePassword(req);
    res.json(result);
  } catch (error) { 
    res.status(400).json({ error: (error as Error).message });
  }
});



export default router;