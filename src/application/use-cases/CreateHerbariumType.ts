import { HerbariumType } from '../../domain/entities/HerbariumType';
import { HerbariumTypeRepository } from '../../domain/repositories/HerbariumTypeRepository';
import { LogEventRepository } from '../../domain/repositories/LogEventRepository';

export class CreateHerbariumType {
    constructor(
        private herbariumTypeRepository: HerbariumTypeRepository,
        private logEventRepository: LogEventRepository
    ) {}

    async execute(data: Omit<HerbariumType, 'id'>, userId: number): Promise<HerbariumType> {
        // Crear el herbarium type
        const newHerbariumType = await this.herbariumTypeRepository.create(data);

        // Registrar el log
        await this.logEventRepository.create({
            user_id: userId,
            herbarium_type_id: newHerbariumType.id,
            description: `Created new herbarium type: ${newHerbariumType.name}`
        });

        return newHerbariumType;
    }
}