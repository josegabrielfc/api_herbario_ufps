import { User } from '../../../domain/entities/User';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import bcrypt from 'bcrypt';

export class CreateUser {
    constructor(private userRepository: UserRepository) {}

    async execute(userData: Omit<User, 'id' | 'created_at'>) {
        // Validar que los campos requeridos existan
        if (!userData?.email || !userData?.password || !userData?.name || !userData?.role_id) {
            return { success: false, message: 'Faltan campos requeridos' };
        }

        const existingUser = await this.userRepository.findByEmail(userData.email);
        if (existingUser) {
            return { success: false, message: 'El email ya está registrado' };
        }

        const hashedPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await this.userRepository.create({
            ...userData,
            password: hashedPassword
        });

        if (!newUser) {
            return { success: false, message: 'Error al crear el usuario' };
        }
        return { 
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role_id: newUser.role_id
            }
        };
    }
}