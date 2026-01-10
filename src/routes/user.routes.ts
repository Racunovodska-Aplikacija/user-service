import { Router } from 'express';
import { getUserById, updateUser } from '../controllers/user.controller';
import { logout } from '../controllers/auth.controller';

const router = Router();

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get current user
 *     description: Retrieve the profile of the currently authenticated user
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: User profile retrieved successfully
 *       '401':
 *         description: Unauthorized
 */
router.get('/me', getUserById);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update current user
 *     description: Update the profile of the currently authenticated user
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: User updated successfully
 *       '401':
 *         description: Unauthorized
 */
router.put('/me', updateUser);

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logout user
 *     description: Logout the currently authenticated user
 *     tags:
 *       - Users
 *     responses:
 *       '200':
 *         description: Logout successful
 *       '401':
 *         description: Unauthorized
 */
router.post('/logout', logout);

export default router;
