import { PlantImg } from '../../../domain/entities/PlantImg';
import { PlantImgRepository } from '../../../domain/repositories/PlantImgRepository';
import { LogEventRepository } from '../../../domain/repositories/LogEventRepository';
import path from 'path';
import fs from 'fs/promises';

export class UpdatePlantImage {
    constructor(
        private plantImgRepository: PlantImgRepository,
        private logEventRepository: LogEventRepository
    ) {}

    async execute(
        id: number,
        file: Express.Multer.File,
        description: string | null,
        userId: number
    ): Promise<PlantImg | null> {
        // Get current image data before update
        const currentImage = await this.plantImgRepository.findById(id);
        if (!currentImage) return null;

        // Setup directories
        const uploadDir = path.join(process.cwd(), 'uploads', 'plants');
        const oldPlantsDir = path.join(process.cwd(), 'uploads', 'plants', 'oldPlants');
        await fs.mkdir(uploadDir, { recursive: true });
        await fs.mkdir(oldPlantsDir, { recursive: true });

        // Move old image to oldPlants directory
        if (currentImage.image_url) {
            const oldImageName = path.basename(currentImage.image_url);
            const oldImagePath = path.join(process.cwd(), currentImage.image_url);
            const newOldImagePath = path.join(oldPlantsDir, oldImageName);

            try {
                await fs.access(oldImagePath);
                await fs.rename(oldImagePath, newOldImagePath);
            } catch (error) {
                console.error('Error moving old image:', error);
            }
        }

        // Upload new image
        const uniqueFileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(uploadDir, uniqueFileName);
        await fs.writeFile(filePath, file.buffer);

        // Update database record
        const plantImg = await this.plantImgRepository.update(id, {
            image_url: `/uploads/plants/${uniqueFileName}`,
            description: description!
        });

        if (plantImg) {
            await this.logEventRepository.create({
                user_id: userId,
                plant_img_id: plantImg.id,
                description: `Updated image for plant ID: ${plantImg.plant_id}. Old image: ${currentImage.image_url} moved to oldPlants. 
                    New image: ${plantImg.image_url}`,
            });
        }

        return plantImg;
    }
}