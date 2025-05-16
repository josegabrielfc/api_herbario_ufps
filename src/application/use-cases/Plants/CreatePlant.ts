import { Plant } from '../../../domain/entities/Plant';
import { PlantRepository } from '../../../domain/repositories/PlantRepository';
import { LogEventRepository } from '../../../domain/repositories/LogEventRepository';

export class CreatePlant {
    constructor(
        private plantRepository: PlantRepository,
        private logEventRepository: LogEventRepository
    ) {}

    async execute(plantData: Omit<Plant, 'id'>, userId: number): Promise<Plant> {
        const plant = await this.plantRepository.create(plantData);

        await this.logEventRepository.create({
            user_id: userId,
            plant_id: plant.id,
            description: `Created new plant: ${plant.scientific_name}`
        });

        return plant;
    }
}