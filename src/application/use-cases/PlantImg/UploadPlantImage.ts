import { PlantImg } from '../../../domain/entities/PlantImg';
import { PlantImgRepository } from '../../../domain/repositories/PlantImgRepository';
import { LogEventRepository } from '../../../domain/repositories/LogEventRepository';
import path from 'path';
import fs from 'fs/promises';

export class UploadPlantImage {
    constructor(
        private plantImgRepository: PlantImgRepository,
        private logEventRepository: LogEventRepository
    ) {}

    async execute(
        plantId: number,
        files: Express.Multer.File[],
        descriptions: string[],
        userId: number
    ): Promise<PlantImg[]> {
        if (files.length === 0) {
            throw new Error('Se requiere al menos 1 imagen');
        }
        if (files.length > 3) {
            throw new Error('Se permite un máximo de 3 imágenes por carga');
        }

        const uploadDir = path.join(process.cwd(), 'uploads', 'plants');
        await fs.mkdir(uploadDir, { recursive: true });

        const plantImgs = await Promise.all(files.map(async (file, index) => {
            const uniqueFileName = `${Date.now()}-${file.originalname}`;
            const filePath = path.join(uploadDir, uniqueFileName);
            
            await fs.writeFile(filePath, file.buffer);
        
            return {
                plant_id: plantId,
                image_url: `/uploads/plants/${uniqueFileName}`,
                description: descriptions[index] || undefined,
                status: true,
                is_deleted: false
            };
        }));

        const savedImages = await this.plantImgRepository.createMultiple(plantImgs);

        // Log the upload
        await this.logEventRepository.create({
            user_id: userId,
            plant_id: plantId,
            description: `Uploaded ${files.length} images for plant ID: ${plantId}`
        });

        return savedImages;
    }
}