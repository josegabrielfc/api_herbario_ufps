import { UserRepository } from '../../../domain/repositories/UserRepository';

export class ValidateForgotPasswordCode {
    constructor(private userRepository: UserRepository) {}

    async execute(email: string, code: string): Promise<boolean> {
        return this.userRepository.validateForgotPasswordCode(email, code);
    }
}