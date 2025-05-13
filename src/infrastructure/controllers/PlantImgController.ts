import { Request, Response } from 'express';
import { UploadPlantImage } from '../../application/use-cases/PlantImg/UploadPlantImage';
import { PlantImgRepositoryImpl } from '../implementations/PlantImgRepositoryImpl';
import { GetPlantImages } from '../../application/use-cases/PlantImg/GetPlantImages';
import { LogEventRepositoryImpl } from '../implementations/LogEventRepositoryImpl';
import { ApiResponse } from '../helpers/ApiResponse';
import multer from 'multer';

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export class PlantImgController {
    private uploadPlantImageUseCase: UploadPlantImage;
    private getPlantImagesUseCase: GetPlantImages;

    constructor() {
        const plantImgRepo = new PlantImgRepositoryImpl();
        const logEventRepo = new LogEventRepositoryImpl();
        this.uploadPlantImageUseCase = new UploadPlantImage(plantImgRepo, logEventRepo);
        this.getPlantImagesUseCase = new GetPlantImages(plantImgRepo);
    }

    async uploadImage(req: Request, res: Response): Promise<Response> {
        const response: ApiResponse = {
            statusCode: 200,
            message: '',
            timestamp: new Date().toISOString(),
            data: null
        };

        try {
            if (!req.user) {
                response.statusCode = 401;
                response.message = 'Usuario no autenticado';
                return res.status(response.statusCode).json(response);
            }

            if (!req.file) {
                response.statusCode = 400;
                response.message = 'No se proporcionó ninguna imagen';
                return res.status(response.statusCode).json(response);
            }

            const plantId = parseInt(req.params.plantId);
            if (isNaN(plantId)) {
                response.statusCode = 400;
                response.message = 'ID de planta inválido';
                return res.status(response.statusCode).json(response);
            }

            const plantImg = await this.uploadPlantImageUseCase.execute(
                plantId,
                req.file,
                req.body.description || null,
                req.user.userId
            );

            response.message = 'Imagen subida exitosamente';
            response.data = plantImg;
            return res.status(response.statusCode).json(response);

        } catch (error) {
            console.error(error);
            response.statusCode = 500;
            response.message = 'Error interno del servidor';
            return res.status(response.statusCode).json(response);
        }
    }
    async getImagesByPlantId(req: Request, res: Response): Promise<Response> {
        const response: ApiResponse = {
            statusCode: 200,
            message: '',
            timestamp: new Date().toISOString(),
            data: null
        };

        try {
            const plantId = parseInt(req.params.plantId);
            if (isNaN(plantId)) {
                response.statusCode = 400;
                response.message = 'ID de planta inválido';
                return res.status(response.statusCode).json(response);
            }

            const images = await this.getPlantImagesUseCase.execute(plantId);

            if (!images || images.length === 0) {
                response.statusCode = 404;
                response.message = 'No se encontraron imágenes para esta planta';
                return res.status(response.statusCode).json(response);
            }

            response.message = 'Imágenes obtenidas exitosamente';
            response.data = images;
            return res.status(response.statusCode).json(response);

        } catch (error) {
            console.error(error);
            response.statusCode = 500;
            response.message = 'Error interno del servidor';
            return res.status(response.statusCode).json(response);
        }
    }
}

export const plantImgController = new PlantImgController();