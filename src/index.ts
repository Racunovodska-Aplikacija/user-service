import 'reflect-metadata';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { initializeDatabase } from './config/database';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const app = express();
const PORT = process.env.PORT || 3000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: FRONTEND_ORIGIN,
    credentials: true,
}));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);

// Swagger setup
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'User Service API',
            version: '1.0.0',
            description: 'API documentation for User Service',
        },
    },
    apis: ['./src/routes/*.ts', './src/entities/*.ts'], // Adjust paths as needed
};
const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use('/user-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Initialize database and start server
initializeDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`User service running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error initializing service:', error);
        process.exit(1);
    });
