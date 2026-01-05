import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { User } from '../entities/User';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.utils';
import { validate } from 'class-validator';

const userRepository = AppDataSource.getRepository(User);

const resolveCookieOptions = () => {
    // Allow overriding via env; default to non-secure for local HTTP
    const cookieSecure = process.env.COOKIE_SECURE === 'true';
    const cookieSameSite = (process.env.COOKIE_SAMESITE as 'lax' | 'none' | 'strict' | undefined)
        || (cookieSecure ? 'none' : 'lax');

    return {
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        path: '/',
        sameSite: cookieSameSite,
        secure: cookieSecure,
    } as const;
};

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Check if user already exists
        const existingUser = await userRepository.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({ message: 'User with this email already exists' });
            return;
        }

        // Create new user
        const user = new User();
        user.email = email;
        user.password = await bcrypt.hash(password, 10);
        user.firstName = firstName;
        user.lastName = lastName;

        // Validate
        const errors = await validate(user);
        if (errors.length > 0) {
            res.status(400).json({ message: 'Validation failed', errors });
            return;
        }

        // Save user
        const savedUser = await userRepository.save(user);

        // Generate token
        const token = generateToken({
            userId: savedUser.id,
            email: savedUser.email,
        });

        // Set JWT in cookie with env-driven flags (defaults allow local HTTP)
        res.cookie('jwt', token, resolveCookieOptions());
        console.log('🍪 Cookie set for registration:', savedUser.email);

        // Return user without password
        const { password: _, ...userWithoutPassword } = savedUser;

        res.status(201).json({
            user: userWithoutPassword,
            message: 'Registered successfully. Token set in cookie.',
            token,
        });
    } catch (error) {
        console.error('Error in register:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return;
        }

        // Find user
        const user = await userRepository.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }

        // Generate token
        const token = generateToken({
            userId: user.id,
            email: user.email,
        });

        res.cookie('jwt', token, resolveCookieOptions());
        console.log('🍪 Cookie set for login:', user.email);

        // Return user without password
        const { password: _, ...userWithoutPassword } = user;

        res.json({
            user: userWithoutPassword,
            message: 'Login successful. Token set in cookie.',
            token,
        });
    } catch (error) {
        console.error('Error in login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        res.clearCookie('jwt', { path: '/' });
        console.log('🍪 Cookie cleared for logout');
        res.json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error in logout:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
