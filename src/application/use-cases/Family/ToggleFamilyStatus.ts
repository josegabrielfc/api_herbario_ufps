import { Family } from '../../../domain/entities/Family';
import { FamilyRepository } from '../../../domain/repositories/FamilyRepository';
import { LogEventRepository } from '../../../domain/repositories/LogEventRepository';

export class ToggleFamilyStatus {
    constructor(
        private familyRepository: FamilyRepository,
        private logEventRepository: LogEventRepository
    ) {}

    async execute(id: number, userId: number): Promise<Family | null> {
        const family = await this.familyRepository.toggleStatus(id);

        if (family) {
            const action = family.status ? 'activated' : 'deactivated';
            await this.logEventRepository.create({
                user_id: userId,
                family_id: family.id,
                description: `${action} family: ${family.name}`
            });
        }

        return family;
    }
}