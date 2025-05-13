import { PlantImg } from '../../domain/entities/PlantImg';
import { PlantImgRepository } from '../../domain/repositories/PlantImgRepository';
import { pool } from '../database/postgresClient';

export class PlantImgRepositoryImpl implements PlantImgRepository {

    async getImgsByPlantId(plantId: number): Promise<PlantImg[]> {
        const query = `
            SELECT id, plant_id, image_url, description, created_at
            FROM plant_img
            WHERE plant_id = $1 AND is_deleted = false
            ORDER BY created_at DESC
        `;
        
        const result = await pool.query(query, [plantId]);
        return result.rows;
    }
    
    async create(plantImg: Omit<PlantImg, 'id' | 'created_at'>): Promise<PlantImg> {
        const query = `
            INSERT INTO plant_img (plant_id, image_url, description, is_deleted)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        
        const values = [
            plantImg.plant_id,
            plantImg.image_url,
            plantImg.description,
            false
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    }

    async getByPlantId(plantId: number): Promise<PlantImg[]> {
        const query = `
            SELECT * FROM plant_img 
            WHERE plant_id = $1 AND is_deleted = false
            ORDER BY created_at DESC
        `;
        
        const result = await pool.query(query, [plantId]);
        return result.rows;
    }
}