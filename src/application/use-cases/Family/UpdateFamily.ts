import { Family } from '../../../domain/entities/Family';
import { FamilyRepository } from '../../../domain/repositories/FamilyRepository';
import { LogEventRepository } from '../../../domain/repositories/LogEventRepository';

export class UpdateFamily {
    constructor(
        private familyRepository: FamilyRepository,
        private logEventRepository: LogEventRepository
    ) {}

    async execute(id: number, data: Partial<Family>, userId: number): Promise<Family | null> {
        const family = await this.familyRepository.update(id, data);

        if (family) {
            await this.logEventRepository.create({
                user_id: userId,
                family_id: family.id,
                description: `Updated family: ${family.name}`
            });
        }

        return family;
    }
}