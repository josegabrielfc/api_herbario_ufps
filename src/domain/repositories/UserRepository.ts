import { User } from '../entities/User';

export interface UserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: number): Promise<User | null>;
    create(user: Omit<User, 'id' | 'created_at'>): Promise<User>;
    updatePassword(userId: number, newPassword: string): Promise<boolean>;
}