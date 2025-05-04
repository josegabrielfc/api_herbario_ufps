import { FamilyRepository } from '../../domain/repositories/FamilyRepository';
import { Family } from '../../domain/entities/Family';
import { pool } from '../database/postgresClient';

export class FamilyRepositoryImpl implements FamilyRepository {
  async getByHerbariumTypeId(herbariumTypeId: number): Promise<Family[]> {
    const result = await pool.query('SELECT * FROM family WHERE herbarium_type_id = $1 AND is_deleted = false', [herbariumTypeId]);
    return result.rows;
  }
}
