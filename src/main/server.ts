import express from 'express';
import { config } from 'dotenv';
import { env } from '../config/env';
import plantRoutes from '../infrastructure/routes/plantRoutes';
import herbariumRoutes from '../infrastructure/routes/herbariumRoutes';
import { testDbConnection } from '../infrastructure/database/postgresClient';
import { initializeDatabase } from '../infrastructure/database/initializeDb';
import familyRoutes from '../infrastructure/routes/familyRoutes';
import authRoutes from '../infrastructure/routes/authRoutes';
import plantImgRoutes from '../infrastructure/routes/plantImgRoutes';
import cors from 'cors';
import path from 'path';

config();

async function startServer() {
    try {
        // Test DB connection
        await testDbConnection();
        
        // Initialize database tables and initial data
        await initializeDatabase();

        const app = express();
        const port = process.env.PORT || 3000;

        app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
        
        // Configurar CORS
        app.use(cors({
            origin: process.env.CORS_ORIGIN || '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization']
        }));

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // Rutas
        app.use(plantRoutes);
        app.use('/', herbariumRoutes);
        app.use('/home', familyRoutes);
        app.use('/auth', authRoutes);
        app.use('/img', plantImgRoutes);

        // Listen for all environments
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        });

        return app;
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Initialize the server
startServer();

export default startServer;
