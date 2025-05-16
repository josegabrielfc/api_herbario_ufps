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

    async findById(id: number): Promise<PlantImg | null> {
        const query = `
            SELECT *
            FROM plant_img
            WHERE id = $1 AND is_deleted = false
        `;
        
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }

    async update(id: number, plantImg: Partial<PlantImg>): Promise<PlantImg | null> {
        const updateFields = [];
        const values = [];
        let paramCount = 1;

        if (plantImg.image_url !== undefined) {
            updateFields.push(`image_url = $${paramCount}`);
            values.push(plantImg.image_url);
            paramCount++;
        }
        if (plantImg.description !== undefined) {
            updateFields.push(`description = $${paramCount}`);
            values.push(plantImg.description);
            paramCount++;
        }

        if (updateFields.length === 0) return null;

        values.push(id);
        const query = `
            UPDATE plant_img 
            SET ${updateFields.join(', ')}
            WHERE id = $${paramCount} AND is_deleted = false
            RETURNING *
        `;

        const result = await pool.query(query, values);
        return result.rows[0] || null;
    }

    async toggleStatus(id: number): Promise<PlantImg | null> {
        const query = `
            UPDATE plant_img 
            SET status = NOT status 
            WHERE id = $1 AND is_deleted = false
            RETURNING *
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }

    async softDelete(id: number): Promise<PlantImg | null> {
        const query = `
            UPDATE plant_img 
            SET is_deleted = true 
            WHERE id = $1 AND is_deleted = false
            RETURNING *
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0] || null;
    }
}