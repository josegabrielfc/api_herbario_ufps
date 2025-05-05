import express from 'express';
import { env } from '../config/env';
import plantRoutes from '../infrastructure/routes/plantRoutes';
import herbariumRoutes from '../infrastructure/routes/herbariumRoutes';
import { testDbConnection } from '../infrastructure/database/postgresClient';
import familyRoutes from '../infrastructure/routes/familyRoutes';
import authRoutes from '../infrastructure/routes/authRoutes';
import cors from 'cors';

const app = express();

// Configurar CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Configurar los dominios permitidos
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use(plantRoutes);
app.use('/', herbariumRoutes);
app.use('/home', familyRoutes);
app.use('/auth', authRoutes);


// Test DB
testDbConnection();

app.listen(env.port, () => {
  console.log(`Servidor corriendo en http://localhost:${env.port}`);
});
