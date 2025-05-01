import { Router } from 'express';
import subscriptionService from '../services/subscriptions';
import { getUser } from '../middleware/user';

const router = Router();

// Create a new subscription
router.post('/', getUser, async (req: any, res) => {
  try {
    const subscription = await subscriptionService.createSubscription(req.user.id, req.body);
    res.status(201).json(subscription);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get all subscriptions
router.get('/', getUser, async (req: any, res) => {
  try {
    const subscriptions = await subscriptionService.getSubscriptions(req.user.id);
    res.json(subscriptions);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get subscription by ID
router.get('/:id', getUser, async (req: any, res) => {
  try {
    const subscription = await subscriptionService.getSubscriptionById(req.params.id, req.user.id);
    res.json(subscription);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// join
router.post('/:id/join', getUser, async (req: any, res) => {
  try {
    const subscription = await subscriptionService.joinSubscription(req.params.id, req.user.id);
    res.status(200).json(subscription);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router; 