import { Plant } from '../../domain/entities/Plant';
import { PlantRepository } from '../../domain/repositories/PlantRepository';
import { pool } from '../database/postgresClient';

export class PlantRepositoryImpl implements PlantRepository {
  async getAll(): Promise<Plant[]> {
    const result = await pool.query(`
      SELECT *
      FROM plant
      WHERE is_deleted = FALSE
    `);
    return result.rows;
  }

  async getByIds(herbariumTypeId: number, familyId: number): Promise<Plant[]> {
    const result = await pool.query(`
      SELECT plant.* FROM plant 
      INNER JOIN family ON family.id = plant.family_id
      WHERE family.herbarium_type_id = $1 
      AND family.id = $2 
      AND plant.is_deleted = FALSE
    `, [herbariumTypeId, familyId]);
    return result.rows;
  }
}