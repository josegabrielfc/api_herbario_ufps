import { User } from '../../../domain/entities/User';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import bcrypt from 'bcrypt';

export class CreateUser {
    constructor(private userRepository: UserRepository) {}

    async execute(userData: Omit<User, 'id' | 'created_at'>): Promise<User | null> {
        // Validar que los campos requeridos existan
        if (!userData?.email || !userData?.password || !userData?.name || !userData?.role_id) {
            throw new Error('Missing required fields');
        }

        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            return null;
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        return this.userRepository.create({
            ...userData,
            password: hashedPassword
        });
    }
}