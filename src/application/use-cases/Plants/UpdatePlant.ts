import { Plant } from '../../../domain/entities/Plant';
import { PlantRepository } from '../../../domain/repositories/PlantRepository';
import { LogEventRepository } from '../../../domain/repositories/LogEventRepository';

export class UpdatePlant {
    constructor(
        private plantRepository: PlantRepository,
        private logEventRepository: LogEventRepository
    ) {}

    async execute(id: number, data: Partial<Plant>, userId: number): Promise<Plant | null> {
        const plant = await this.plantRepository.update(id, data);

        if (plant) {
            await this.logEventRepository.create({
                user_id: userId,
                plant_id: plant.id,
                description: `Updated plant: ${plant.scientific_name}`
            });
        }

        return plant;
    }
}