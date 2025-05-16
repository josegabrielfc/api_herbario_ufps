import { Plant } from '../../../domain/entities/Plant';
import { PlantRepository } from '../../../domain/repositories/PlantRepository';
import { LogEventRepository } from '../../../domain/repositories/LogEventRepository';

export class SoftDeletePlant {
    constructor(
        private plantRepository: PlantRepository,
        private logEventRepository: LogEventRepository
    ) {}

    async execute(id: number, userId: number): Promise<Plant | null> {
        const plant = await this.plantRepository.softDelete(id);

        if (plant) {
            await this.logEventRepository.create({
                user_id: userId,
                plant_id: plant.id,
                description: `Soft deleted plant: ${plant.scientific_name}`
            });
        }

        return plant;
    }
}