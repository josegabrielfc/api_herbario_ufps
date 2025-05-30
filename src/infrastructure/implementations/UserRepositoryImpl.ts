import { User } from '../../domain/entities/User';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { pool } from '../database/postgresClient';

export class UserRepositoryImpl implements UserRepository {
    async findByEmail(email: string): Promise<User | null> {
        const result = await pool.query(
            'SELECT * FROM "User" WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    }

    async findById(id: number): Promise<User | null> {
        const result = await pool.query(
            'SELECT * FROM "User" WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    async create(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
        const result = await pool.query(
            'INSERT INTO "User" (name, email, password, role_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [user.name, user.email, user.password, user.role_id]
        );
        return result.rows[0];
    }

    async updatePassword(userId: number, newPassword: string): Promise<boolean> {
        const result = await pool.query(
            'UPDATE "User" SET password = $1 WHERE id = $2',
            [newPassword, userId]
        );
        return (result.rowCount ?? 0) > 0;
    }
    async updateUserToken(userId: number, token: string): Promise<boolean> {
        const result = await pool.query(
            'UPDATE "User" SET token = $1 WHERE id = $2',
            [token, userId]
        );
        return (result.rowCount ?? 0) > 0;
    }

    async updateForgotPasswordCode(email: string, code: string): Promise<boolean> {
        const result = await pool.query(
            'UPDATE "User" SET forgot_password_code = $1 WHERE email = $2',
            [code, email]
        );
        return (result.rowCount ?? 0) > 0;
    }

    async validateForgotPasswordCode(email: string, code: string): Promise<boolean> {
        const result = await pool.query(
            'SELECT id FROM "User" WHERE email = $1 AND forgot_password_code = $2',
            [email, code]
        );
        return (result.rowCount ?? 0) > 0;
    }
}