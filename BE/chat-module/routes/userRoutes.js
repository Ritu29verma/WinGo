import express from 'express';
import { checkOrRegisterUser } from '../controllers/usercontroller.js';

const router = express.Router();

router.post('/check-or-register', checkOrRegisterUser);

export default router;
