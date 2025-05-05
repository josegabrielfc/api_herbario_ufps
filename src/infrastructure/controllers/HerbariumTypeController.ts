import { Request, Response } from 'express';
import { GetAllHerbariumTypes } from '../../application/use-cases/GetAllHerbariumTypes';
import { CreateHerbariumType } from '../../application/use-cases/CreateHerbariumType';
import { HerbariumTypeRepositoryImpl } from '../implementations/HerbariumTypeRepositoryImpl';
import { LogEventRepositoryImpl } from '../implementations/LogEventRepositoryImpl';
import { ApiResponse } from '../helpers/ApiResponse';

export class HerbariumTypeController {
    private getAllHerbariumTypesUseCase: GetAllHerbariumTypes;
    private createHerbariumTypeUseCase: CreateHerbariumType;

    constructor() {
        const herbariumRepo = new HerbariumTypeRepositoryImpl();
        const logEventRepo = new LogEventRepositoryImpl();
        
        this.getAllHerbariumTypesUseCase = new GetAllHerbariumTypes(herbariumRepo);
        this.createHerbariumTypeUseCase = new CreateHerbariumType(herbariumRepo, logEventRepo);
    }

    async getAllHerbariumTypes(req: Request, res: Response): Promise<Response> {
        const response: ApiResponse = {
            statusCode: 200,
            message: '',
            timestamp: new Date().toISOString(),
            data: null
        };

        try {
            const herbariums = await this.getAllHerbariumTypesUseCase.execute();

            if (!herbariums || (Array.isArray(herbariums) && herbariums.length === 0)) {
                response.statusCode = 404;
                response.message = 'No se encontraron tipos de herbario';
                return res.status(response.statusCode).json(response);
            }

            response.message = 'Tipos de herbario obtenidos exitosamente';
            response.data = herbariums;
            return res.status(response.statusCode).json(response);

        } catch (error) {
            console.error(error);
            response.statusCode = 500;
            response.message = 'Error interno del servidor';
            return res.status(response.statusCode).json(response);
        }
    }

    async createHerbariumType(req: Request, res: Response): Promise<Response> {
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

            const herbariumTypeData = {
                name: req.body.name,
                description: req.body.description || null,
                status: true,
                is_deleted: false
            };

            const newHerbariumType = await this.createHerbariumTypeUseCase.execute(
                herbariumTypeData,
                req.user.userId
            );

            response.message = 'Tipo de herbario creado exitosamente';
            response.data = newHerbariumType;
            return res.status(response.statusCode).json(response);

        } catch (error) {
            console.error(error);
            response.statusCode = 500;
            response.message = 'Error interno del servidor';
            return res.status(response.statusCode).json(response);
        }
    }
}

export const herbariumTypeController = new HerbariumTypeController();