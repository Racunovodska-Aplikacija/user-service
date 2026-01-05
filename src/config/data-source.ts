import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities/User';

dotenv.config();

const isDev = process.env.NODE_ENV === 'development';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'userdb',
    synchronize: isDev,
    logging: isDev,
    entities: isDev ? [User] : ['dist/entities/*.js'],
    migrations: isDev ? ['src/migrations/*.ts'] : ['dist/migrations/*.js'],
    subscribers: [],
});