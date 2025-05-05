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
}