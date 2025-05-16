import { UserRepository } from '../../../domain/repositories/UserRepository';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export class LoginUser {
    constructor(private userRepository: UserRepository) {}

    async execute(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);
        
        if (!user) {
            return { success: false, message: 'Credenciales inválidas' };
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return { success: false, message: 'Credenciales inválidas' };
        }

        // Generar token JWT
        const token = jwt.sign(
            { userId: user.id, roleId: user.role_id },
            process.env.JWT_SECRET || 'tu-secreto-seguro',
            { expiresIn: '24h' } // Token válido por 24 horas
        );

        // Actualizar el token en la base de datos
        await this.userRepository.updateUserToken(user.id, token);

        return { 
            success: true, 
            data: { 
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role_id: user.role_id
                }
            } 
        };
    }
}