import { User } from '../../../domain/entities/User';
import { UserRepository } from '../../../domain/repositories/UserRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class LoginUser {
    constructor(private userRepository: UserRepository) {}

    async execute(email: string, password: string): Promise<string | null> {
        const user = await this.userRepository.findByEmail(email);
        console.log(user);
        if (!user) {
            return null;
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log(isValidPassword);
        if (!isValidPassword) {
            return null;
        }

        const token = jwt.sign(
            { userId: user.id, roleId: user.role_id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '1h' }
        );

        return token;
    }
}