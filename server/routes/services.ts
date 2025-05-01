import { Router } from 'express';
import serviceService from '../services/services';
import { getUser } from '../middleware/user';
import subscriptionService from '../services/subscriptions';

const router = Router();

// Public routes
router.get('/', async (req, res) => {
  try {
    const services = await subscriptionService.getServices();
    res.json(services);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const service = await serviceService.getService(req.params.id);
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Admin only routes
router.post('/', getUser, async (req: any, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const service = await serviceService.createService(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/:id', getUser, async (req: any, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const service = await serviceService.updateService(req.params.id, req.body);
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/:id', getUser, async (req: any, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const service = await serviceService.deleteService(req.params.id);
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/:id/plans/:planId', getUser, async (req: any, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    } 
    const service = await serviceService.deleteServicePlan(req.params.id, req.params.planId);
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/:id/plans', getUser, async (req: any, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const service = await serviceService.addServicePlan(req.params.id, req.body);
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/:id/plans/:planId', getUser, async (req: any, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const service = await serviceService.updateServicePlan(req.params.id, req.params.planId, req.body);
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.post('/:id/access-fields', getUser, async (req: any, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const service = await serviceService.addAccessField(req.params.id, req.body);
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.put('/:id/access-fields/:fieldId', getUser, async (req: any, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const service = await serviceService.updateAccessField(req.params.id, req.params.fieldId, req.body);
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

router.delete('/:id/access-fields/:fieldId', getUser, async (req: any, res) => {
  try {
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const service = await serviceService.deleteAccessField(req.params.id, req.params.fieldId);
    res.json(service);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});


















export default router; 