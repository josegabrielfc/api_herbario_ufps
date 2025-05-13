import { PlantImg } from '../../../domain/entities/PlantImg';
import { PlantImgRepository } from '../../../domain/repositories/PlantImgRepository';

export class GetPlantImages {
    constructor(private plantImgRepository: PlantImgRepository) {}

    async execute(plantId: number): Promise<PlantImg[]> {
        return this.plantImgRepository.getByPlantId(plantId);
    }
}