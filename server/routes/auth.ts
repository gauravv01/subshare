import { Router, Request, Response } from 'express';
import authService from '../services/auth';

const router = Router();

router.post("/signup", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await authService.signup(email, password);
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const { user, token } = await authService.login(email, password);
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router;