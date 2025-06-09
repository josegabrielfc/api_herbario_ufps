import { pool } from './postgresClient';
import { tableSchemas, triggerSchemas } from './schemas';

export async function initializeDatabase() {
    try {
        console.log('\n🔍 Iniciando verificación de tablas...');

        // Crear tablas en orden específico debido a las dependencias
        for (const [tableName, schema] of Object.entries(tableSchemas)) {
            try {
                await pool.query(schema);
            } catch (error) {
                console.error(`❌ Error al crear tabla ${tableName}:`, error);
                throw error;
            }
        }
        console.log(`✅ Tablas verificadas/creadas exitosamente`);

        // Crear triggers
        console.log('🔧 Verificando triggers...');
        for (const [triggerName, triggerSchema] of Object.entries(triggerSchemas)) {
            try {
                await pool.query(triggerSchema);
            } catch (error) {
                console.error(`❌ Error al crear trigger ${triggerName}:`, error);
                throw error;
            }
        }
        console.log(`✅ Triggers verificados/creados exitosamente`);

        // Insertar datos iniciales si es necesario
        await insertInitialData();

        console.log('✨ Base de datos inicializada exitosamente\n');
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error);
        throw error;
    }
}

async function insertInitialData() {
    try {
        // Verificar si ya existe el rol admin
        const roleExists = await pool.query(
            'SELECT COUNT(*) FROM role WHERE id = 1'
        );

        if (parseInt(roleExists.rows[0].count) === 0) {
            // Crear rol admin por defecto
            await pool.query(`
                INSERT INTO role (id, name)
                VALUES (1, 'admin')
            `);
            console.log('👑 Rol admin creado exitosamente');
        }

        // Verificar si ya existe un usuario admin
        const adminExists = await pool.query(
            'SELECT COUNT(*) FROM "User" WHERE role_id = 1'
        );

        if (parseInt(adminExists.rows[0].count) === 0) {
            // Crear usuario admin por defecto
            await pool.query(`
                INSERT INTO "User" (name, email, password, role_id)
                VALUES (
                    'Admin',
                    'admin@ufps.edu.co',
                    '$2b$10$lpJdl1xojNxcGLKCwZ9TKuCU/wnrReUgkZnpirEv13d9pic1hBnYi',
                    1
                )
            `);
            console.log('👤 Usuario admin creado exitosamente');
        }

    } catch (error) {
        console.error('❌ Error al insertar datos iniciales:', error);
        throw error;
    }
}