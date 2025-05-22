import { FamilyRepository } from '../../domain/repositories/FamilyRepository';
import { Family } from '../../domain/entities/Family';
import { pool } from '../database/postgresClient';

export class FamilyRepositoryImpl implements FamilyRepository {
  async findByHerbariumTypeId(herbariumTypeId: number): Promise<Family[]> {
    const result = await pool.query('SELECT * FROM family WHERE herbarium_type_id = $1 AND is_deleted = false order by name', [herbariumTypeId]);
    return result.rows;
  }

  async findById(id: number): Promise<Family | null> {
    const result = await pool.query(
        'SELECT * FROM family WHERE id = $1 AND is_deleted = false',
        [id]
    );
    return result.rows[0] || null;
}

async create(family: Omit<Family, 'id'>): Promise<Family> {
    const result = await pool.query(
        `INSERT INTO family (
            herbarium_type_id, name, description, status, is_deleted
        ) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [family.herbarium_type_id, family.name, family.description, family.status, false]
    );
    return result.rows[0];
}

async update(id: number, family: Partial<Family>): Promise<Family | null> {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (family.name !== undefined) {
        updateFields.push(`name = $${paramCount}`);
        values.push(family.name);
        paramCount++;
    }
    if (family.description !== undefined) {
        updateFields.push(`description = $${paramCount}`);
        values.push(family.description);
        paramCount++;
    }
    if (family.status !== undefined) {
        updateFields.push(`status = $${paramCount}`);
        values.push(family.status);
        paramCount++;
    }

    if (updateFields.length === 0) return null;

    values.push(id);
    const query = `
        UPDATE family 
        SET ${updateFields.join(', ')}
        WHERE id = $${paramCount} AND is_deleted = false
        RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
}

async toggleStatus(id: number): Promise<Family | null> {
    const result = await pool.query(
        'UPDATE family SET status = NOT status WHERE id = $1 AND is_deleted = false RETURNING *',
        [id]
    );
    return result.rows[0] || null;
}

async softDelete(id: number): Promise<Family | null> {
    const result = await pool.query(
        'UPDATE family SET is_deleted = true WHERE id = $1 AND is_deleted = false RETURNING *',
        [id]
    );
    return result.rows[0] || null;
}
}
