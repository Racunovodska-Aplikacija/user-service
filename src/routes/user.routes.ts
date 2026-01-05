import { Router } from 'express';
import { getUserById, updateUser } from '../controllers/user.controller';
import { logout } from '../controllers/auth.controller';

const router = Router();

router.get('/me', getUserById);
router.put('/me', updateUser);
router.post('/logout', logout);

export default router;
