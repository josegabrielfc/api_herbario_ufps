import { HerbariumType } from '../../../domain/entities/HerbariumType';
import { HerbariumTypeRepository } from '../../../domain/repositories/HerbariumTypeRepository';
import { LogEventRepository } from '../../../domain/repositories/LogEventRepository';

export class SoftDeleteHerbariumType {
    constructor(
        private herbariumTypeRepository: HerbariumTypeRepository,
        private logEventRepository: LogEventRepository
    ) {}

    async execute(id: number, userId: number): Promise<HerbariumType | null> {
        const deletedHerbariumType = await this.herbariumTypeRepository.softDelete(id);

        if (deletedHerbariumType) {
            await this.logEventRepository.create({
                user_id: userId,
                herbarium_type_id: id,
                description: `Soft deleted herbarium type: ${deletedHerbariumType.name}`
            });
        }

        return deletedHerbariumType;
    }
}