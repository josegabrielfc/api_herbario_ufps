import { UserRepository } from '../../../domain/repositories/UserRepository';
import { EmailService } from '../../../infrastructure/services/EmailService';
export class SendForgotPasswordCode {
    constructor(
        private userRepository: UserRepository,
        private emailService: EmailService
    ) {}

    async execute(email: string): Promise<boolean> {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            return false;
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString();
        await this.userRepository.updateForgotPasswordCode(email, code);
        
        return this.emailService.sendForgotPasswordCode(email, code);
    }
}