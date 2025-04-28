import { Router } from 'express';
import membershipService from '../services/memberships';
import { getUser } from '../middleware/user';

const router = Router();

router.get('/:subscriptionId/members', getUser, async (req: any, res) => {
  try {
    const members = await membershipService.getMembers(req.params.subscriptionId);
    res.json(members);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
}); 



router.post('/:subscriptionId/join', getUser, async (req: any, res) => {
  try {
    const membership = await membershipService.joinSubscription(
      req.params.subscriptionId,
      req.user.id
    );
    res.status(201).json(membership);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/:subscriptionId/leave', getUser, async (req: any, res) => {
  try {
    await membershipService.leaveSubscription(
      req.params.subscriptionId,
      req.user.id
    );
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/:subscriptionId/members/:userId', getUser, async (req: any, res) => {
  try {
    const membership = await membershipService.updateMemberRole(
      req.params.subscriptionId,
      req.params.userId,
      req.body.role,
      req.user.id
    );
    res.json(membership);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

export default router; 