import { Family } from '../../../domain/entities/Family';
import { FamilyRepository } from '../../../domain/repositories/FamilyRepository';
import { LogEventRepository } from '../../../domain/repositories/LogEventRepository';

export class SoftDeleteFamily {
    constructor(
        private familyRepository: FamilyRepository,
        private logEventRepository: LogEventRepository
    ) {}

    async execute(id: number, userId: number): Promise<Family | null> {
        const family = await this.familyRepository.softDelete(id);

        if (family) {
            await this.logEventRepository.create({
                user_id: userId,
                family_id: family.id,
                description: `Soft deleted family: ${family.name}`
            });
        }

        return family;
    }
}