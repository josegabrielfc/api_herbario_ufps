import { LogEvent } from '../../domain/entities/LogEvent';
import { LogEventRepository } from '../../domain/repositories/LogEventRepository';
import { pool } from '../database/postgresClient';

export class LogEventRepositoryImpl implements LogEventRepository {
    async create(logEvent: Omit<LogEvent, 'id' | 'created_at'>): Promise<LogEvent> {
        const query = `
            INSERT INTO Log_event (
                user_id, 
                herbarium_type_id, 
                family_id, 
                plant_id, 
                plant_img_id, 
                description
            ) 
            VALUES ($1, $2, $3, $4, $5, $6) 
            RETURNING *
        `;

        const values = [
            logEvent.user_id,
            logEvent.herbarium_type_id || null,
            logEvent.family_id || null,
            logEvent.plant_id || null,
            logEvent.plant_img_id || null,
            logEvent.description
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }
}