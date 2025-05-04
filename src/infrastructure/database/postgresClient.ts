import { Pool } from 'pg';
import { env } from '../../config/env';

export const pool = new Pool({
  connectionString: env.databaseUrl,
});

export const testDbConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('✅ Conexión a la base de datos establecida correctamente');
    client.release();
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
  }
};