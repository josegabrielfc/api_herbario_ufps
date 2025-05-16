import { PlantImg } from "../../../domain/entities/PlantImg";
import { LogEventRepository } from "../../../domain/repositories/LogEventRepository";
import { PlantImgRepository } from "../../../domain/repositories/PlantImgRepository";

export class SoftDeletePlantImage {
    constructor(
        private plantImgRepository: PlantImgRepository,
        private logEventRepository: LogEventRepository
    ) {}

    async execute(id: number, userId: number): Promise<PlantImg | null> {
        const plantImg = await this.plantImgRepository.softDelete(id);

        if (plantImg) {
            await this.logEventRepository.create({
                user_id: userId,
                plant_img_id: plantImg.id,
                description: `Soft deleted plant image`
            });
        }

        return plantImg;
    }
}