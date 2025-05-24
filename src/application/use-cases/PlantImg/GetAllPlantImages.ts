import { PlantPlantImg } from '../../../domain/entities/PlantPlantImg';
import { PlantImgRepository } from '../../../domain/repositories/PlantImgRepository';

export class GetAllPlantImages {
    constructor(private plantImgRepository: PlantImgRepository) {}

    async execute(): Promise<PlantPlantImg[]> {
        return this.plantImgRepository.getAllPlantImages();
    }

    async executeForUsers(): Promise<PlantPlantImg[]> {
        return this.plantImgRepository.getAllPlantImagesForUsers();
    }
}