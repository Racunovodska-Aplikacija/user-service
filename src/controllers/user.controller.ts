import { Request, Response } from 'express';
import { validate } from 'class-validator';
import bcrypt from 'bcrypt';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';

const userRepository = AppDataSource.getRepository(User);

// Helper function to extract userId from JWT
const extractUserIdFromToken = (req: Request): string | null => {
    let token = '';
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    } else if (req.cookies?.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) return null;

    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const decoded = JSON.parse(Buffer.from(parts[1], 'base64').toString());
        return decoded.userId;
    } catch {
        return null;
    }
};

// Get current user profile
export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = extractUserIdFromToken(req);

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await userRepository.findOne({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const { password: _pw, ...withoutPassword } = user as User & { password?: string };
        res.json(withoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user' });
    }
};

// Update current user
export const updateUser = async (req: Request, res: Response) => {
    try {
        const userId = extractUserIdFromToken(req);

        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { email, firstName, lastName, password } = req.body;

        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (email) user.email = email;
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        if (password) {
            if (typeof password !== 'string' || password.length < 6) {
                return res.status(400).json({ message: 'Password must be at least 6 characters' });
            }
            user.password = await bcrypt.hash(password, 10);
        }

        const errors = await validate(user);
        if (errors.length > 0) {
            return res.status(400).json({ errors });
        }

        const updatedUser = await userRepository.save(user);
        const { password: _pw, ...withoutPassword } = updatedUser as User & { password?: string };
        res.json(withoutPassword);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user' });
    }
};
