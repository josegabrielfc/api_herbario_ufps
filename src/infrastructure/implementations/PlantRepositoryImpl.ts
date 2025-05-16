import { Plant } from "../../domain/entities/Plant";
import { PlantRepository } from "../../domain/repositories/PlantRepository";
import { pool } from "../database/postgresClient";

export class PlantRepositoryImpl implements PlantRepository {
  async getAll(): Promise<Plant[]> {
    const result = await pool.query(`
      SELECT plant.*, family.name as family_name 
      FROM plant inner join family on family.id = plant.family_id
      WHERE plant.is_deleted = FALSE
    `);
    return result.rows;
  }

  async getByIds(herbariumTypeId: number, familyId: number): Promise<Plant[]> {
    const result = await pool.query(
      `
      SELECT plant.* FROM plant 
      INNER JOIN family ON family.id = plant.family_id
      WHERE family.herbarium_type_id = $1 
      AND family.id = $2 
      AND plant.is_deleted = FALSE
    `,
      [herbariumTypeId, familyId]
    );
    return result.rows;
  }

  async create(plant: Omit<Plant, "id">): Promise<Plant> {
    const result = await pool.query(
      `INSERT INTO plant (
            family_id, common_name, scientific_name, 
            quantity, description, status, is_deleted
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *`,
      [
        plant.family_id,
        plant.common_name,
        plant.scientific_name,
        plant.quantity,
        plant.description,
        plant.status,
        false,
      ]
    );
    return result.rows[0];
  }

  async update(id: number, plant: Partial<Plant>): Promise<Plant | null> {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (plant.common_name !== undefined) {
      updateFields.push(`common_name = $${paramCount}`);
      values.push(plant.common_name);
      paramCount++;
    }
    if (plant.scientific_name !== undefined) {
      updateFields.push(`scientific_name = $${paramCount}`);
      values.push(plant.scientific_name);
      paramCount++;
    }
    if (plant.quantity !== undefined) {
      updateFields.push(`quantity = $${paramCount}`);
      values.push(plant.quantity);
      paramCount++;
    }
    if (plant.description !== undefined) {
      updateFields.push(`description = $${paramCount}`);
      values.push(plant.description);
      paramCount++;
    }

    if (updateFields.length === 0) return null;

    values.push(id);
    const query = `
        UPDATE plant 
        SET ${updateFields.join(", ")}
        WHERE id = $${paramCount} AND is_deleted = false
        RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  async toggleStatus(id: number): Promise<Plant | null> {
    const result = await pool.query(
      "UPDATE plant SET status = NOT status WHERE id = $1 AND is_deleted = false RETURNING *",
      [id]
    );
    return result.rows[0] || null;
  }

  async softDelete(id: number): Promise<Plant | null> {
    const result = await pool.query(
      "UPDATE plant SET is_deleted = true WHERE id = $1 AND is_deleted = false RETURNING *",
      [id]
    );
    return result.rows[0] || null;
  }
}
