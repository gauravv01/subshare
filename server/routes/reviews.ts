import { Router } from 'express';
import reviewService from '../services/reviews';
import { getUser } from '../middleware/user';

const router = Router();

router.post('/:subscriptionId', getUser, async (req: any, res) => {
  try {
    const review = await reviewService.createReview(
      req.user.id,
      req.params.subscriptionId,
      req.body
    );
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/subscription/:subscriptionId', async (req, res) => {
  try {
    const reviews = await reviewService.getSubscriptionReviews(req.params.subscriptionId);
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const reviews = await reviewService.getUserReviews(req.params.userId);
    res.json(reviews);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router; 