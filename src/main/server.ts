import express from 'express';
import { env } from '../config/env';
import plantRoutes from '../infrastructure/routes/plantRoutes';
import herbariumRoutes from '../infrastructure/routes/herbariumRoutes';
import { testDbConnection } from '../infrastructure/database/postgresClient';
import familyRoutes from '../infrastructure/routes/familyRoutes';

const app = express();
app.use(express.json());

// Rutas
app.use(plantRoutes);
app.use('/', herbariumRoutes);
app.use('/home', familyRoutes);


// Test DB
testDbConnection();

app.listen(env.port, () => {
  console.log(`Servidor corriendo en http://localhost:${env.port}`);
});
