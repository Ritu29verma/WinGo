import express from 'express';
import { checkOrRegisterAgent } from '../controllers/agentController.js';

const router = express.Router();

router.post('/check-or-register', checkOrRegisterAgent);

export default router;
