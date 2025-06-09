import { UserRepository } from '../../../domain/repositories/UserRepository';
import bcrypt from 'bcrypt';

export class UpdateUserPassword {
    constructor(private userRepository: UserRepository) {}

    async execute(userId: number, newPassword: string): Promise<boolean> {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            return false;
        }

        // const isValidPassword = await bcrypt.compare(currentPassword, user.password);

        // if (!isValidPassword) {
        //     return false;
        // }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        return this.userRepository.updatePassword(userId, hashedNewPassword);
    }
}