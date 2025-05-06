import { HerbariumType } from '../../domain/entities/HerbariumType';
import { HerbariumTypeRepository } from '../../domain/repositories/HerbariumTypeRepository';
import { LogEventRepository } from '../../domain/repositories/LogEventRepository';

export class ToggleHerbariumTypeStatus {
    constructor(
        private herbariumTypeRepository: HerbariumTypeRepository,
        private logEventRepository: LogEventRepository
    ) {}

    async execute(id: number, userId: number): Promise<HerbariumType | null> {
        const updatedHerbariumType = await this.herbariumTypeRepository.toggleStatus(id);

        if (updatedHerbariumType) {
            const action = updatedHerbariumType.status ? 'activated' : 'deactivated';
            await this.logEventRepository.create({
                user_id: userId,
                herbarium_type_id: id,
                description: `${action} herbarium type: ${updatedHerbariumType.name}`
            });
        }

        return updatedHerbariumType;
    }
}