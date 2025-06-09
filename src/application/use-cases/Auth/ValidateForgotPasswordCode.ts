import { UserRepository } from '../../../domain/repositories/UserRepository';
import jwt from 'jsonwebtoken';

export class ValidateForgotPasswordCode {
    constructor(private userRepository: UserRepository) {}

    async execute(email: string, code: string) {
        const isValid = await this.userRepository.validateForgotPasswordCode(email, code);

        if (!isValid) {
            return { success: false, message: 'Código inválido' };
        }

        const user = await this.userRepository.findByEmail(email);
        
        if (!user) {
            return { success: false, message: 'Usuario no encontrado' };
        }

        // Generar token JWT
        const token = jwt.sign(
            { userId: user.id, roleId: user.role_id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
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