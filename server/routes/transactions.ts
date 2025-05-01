import { Router } from 'express';
import transactionService from '../services/transactions';
import { getUser } from '../middleware/user';

const router = Router();

router.get('/', getUser, async (req: any, res) => {
  try {
    const transactions = await transactionService.getTransactions(req.user.id);
    res.json(transactions);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/payment', getUser, async (req: any, res) => {
  try {
    const transaction = await transactionService.createPayment(
      req.body
    );
    res.status(201).json(transaction);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/refund/:transactionId', getUser, async (req: any, res) => {
  try {
    const refund = await transactionService.createRefund(
      req.params.transactionId,
      req.user.id
    );
    res.status(201).json(refund);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/member/:memberId', getUser, async (req: any, res) => {
  try {
    const transactions = await transactionService.getMemberTransactions(req.params.memberId);
    res.json(transactions);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});



export default router; 