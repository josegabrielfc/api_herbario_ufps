import { Family } from '../../../domain/entities/Family';
import { FamilyRepository } from '../../../domain/repositories/FamilyRepository';
import { LogEventRepository } from '../../../domain/repositories/LogEventRepository';

export class CreateFamily {
    constructor(
        private familyRepository: FamilyRepository,
        private logEventRepository: LogEventRepository
    ) {}

    async execute(familyData: Omit<Family, 'id'>, userId: number): Promise<Family> {
        const family = await this.familyRepository.create(familyData);

        await this.logEventRepository.create({
            user_id: userId,
            family_id: family.id,
            description: `Created new family: ${family.name}`
        });

        return family;
    }
}