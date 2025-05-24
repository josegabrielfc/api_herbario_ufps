import express from 'express';
import { config } from 'dotenv';
import { env } from '../config/env';
import plantRoutes from '../infrastructure/routes/plantRoutes';
import herbariumRoutes from '../infrastructure/routes/herbariumRoutes';
import { testDbConnection } from '../infrastructure/database/postgresClient';
import familyRoutes from '../infrastructure/routes/familyRoutes';
import authRoutes from '../infrastructure/routes/authRoutes';
import plantImgRoutes from '../infrastructure/routes/plantImgRoutes';
import cors from 'cors';
import path from 'path';

config();

const app = express();
const port = process.env.PORT || 3000;

app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));
// Configurar CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Configurar los dominios permitidos
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


// Test DB
testDbConnection();

export default app;

// Only listen if we're not in Vercel
if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}
