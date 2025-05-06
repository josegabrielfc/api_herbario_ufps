import { HerbariumTypeRepository } from '../../domain/repositories/HerbariumTypeRepository';
import { HerbariumType } from '../../domain/entities/HerbariumType';
import { pool } from '../database/postgresClient';

export class HerbariumTypeRepositoryImpl implements HerbariumTypeRepository {
  async getAll(): Promise<HerbariumType[]> {
    const result = await pool.query(`
      SELECT *
      FROM herbarium_type
      WHERE is_deleted = FALSE
    `);
    return result.rows;
  }

  async create(data: Omit<HerbariumType, 'id'>): Promise<HerbariumType> {
    const result = await pool.query(`
        INSERT INTO herbarium_type (name, description, status, is_deleted)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `, [data.name, data.description, data.status, false]);
    
    return result.rows[0];
  }

  async update(id: number, data: Partial<HerbariumType>): Promise<HerbariumType | null> {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (data.name !== undefined) {
        updateFields.push(`name = $${paramCount}`);
        values.push(data.name);
        paramCount++;
    }
    if (data.description !== undefined) {
        updateFields.push(`description = $${paramCount}`);
        values.push(data.description);
        paramCount++;
    }
    if (data.status !== undefined) {
        updateFields.push(`status = $${paramCount}`);
        values.push(data.status);
        paramCount++;
    }

    if (updateFields.length === 0) return null;

    values.push(id);
    const query = `
        UPDATE herbarium_type 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount} AND is_deleted = false
        RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async toggleStatus(id: number): Promise<HerbariumType | null> {
    const query = `
        UPDATE herbarium_type 
        SET status = NOT status 
        WHERE id = $1 AND is_deleted = false
        RETURNING *
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  async softDelete(id: number): Promise<HerbariumType | null> {
    const query = `
        UPDATE herbarium_type 
        SET is_deleted = true 
        WHERE id = $1 AND is_deleted = false
        RETURNING *
    `;
    
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }
}