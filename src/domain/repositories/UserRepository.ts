import { User } from '../entities/User';

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(user: Omit<User, 'id' | 'created_at'>): Promise<User>;
    updatePassword(userId: number, newPassword: string): Promise<boolean>;
    updateUserToken(userId: number, token: string): Promise<boolean>;
    updateForgotPasswordCode(email: string, code: string): Promise<boolean>;
    validateForgotPasswordCode(email: string, code: string): Promise<boolean>;
}