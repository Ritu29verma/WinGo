import express from 'express';
import { registerUser, getAllUsers } from '../controllers/usercontroller.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/', getAllUsers);

export default router;
