import { HerbariumType } from '../../../domain/entities/HerbariumType';
import { HerbariumTypeRepository } from '../../../domain/repositories/HerbariumTypeRepository';
import { LogEventRepository } from '../../../domain/repositories/LogEventRepository';

export class UpdateHerbariumType {
    constructor(
        private herbariumTypeRepository: HerbariumTypeRepository,
        private logEventRepository: LogEventRepository
    ) {}

    async execute(
        id: number, 
        data: Partial<HerbariumType>, 
        userId: number
    ): Promise<HerbariumType | null> {
        const updatedHerbariumType = await this.herbariumTypeRepository.update(id, data);

        if (updatedHerbariumType) {
            // Registrar el log de la actualización
            await this.logEventRepository.create({
                user_id: userId,
                herbarium_type_id: id,
                description: `Updated herbarium type: ${updatedHerbariumType.name}`
            });
        }

        return updatedHerbariumType;
    }
}