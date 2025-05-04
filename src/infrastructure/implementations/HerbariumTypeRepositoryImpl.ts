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
}