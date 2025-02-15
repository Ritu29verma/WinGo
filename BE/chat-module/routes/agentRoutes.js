import express from 'express';
import { registerAgent, getAllAgents } from '../controllers/agentController.js';

const router = express.Router();

router.post('/register', registerAgent);
router.get('/', getAllAgents);

export default router;
