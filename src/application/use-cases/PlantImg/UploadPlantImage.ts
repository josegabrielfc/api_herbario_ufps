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
        file: Express.Multer.File,
        description: string | null,
        userId: number
    ): Promise<PlantImg> {
        // Crear directorio si no existe
        const uploadDir = path.join(process.cwd(), 'uploads', 'plants');
        await fs.mkdir(uploadDir, { recursive: true });

        // Generar nombre único para el archivo
        const uniqueFileName = `${Date.now()}-${file.originalname}`;
        const filePath = path.join(uploadDir, uniqueFileName);

        // Guardar archivo
        await fs.writeFile(filePath, file.buffer);

        // Crear registro en base de datos
        const plantImg = await this.plantImgRepository.create({
            plant_id: plantId,
            image_url: `/uploads/plants/${uniqueFileName}`,
            description: description || undefined,
            is_deleted: false
        });

        // Registrar log
        await this.logEventRepository.create({
            user_id: userId,
            plant_id: plantId,
            plant_img_id: plantImg.id,
            description: `Uploaded image for plant ID: ${plantId}`
        });

        return plantImg;
    }
}