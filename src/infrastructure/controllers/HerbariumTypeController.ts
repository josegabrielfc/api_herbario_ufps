import { Request, Response } from 'express';
import { GetAllHerbariumTypes } from '../../application/use-cases/Herbarium/GetAllHerbariumTypes';
import { CreateHerbariumType } from '../../application/use-cases/Herbarium/CreateHerbariumType';
import { UpdateHerbariumType } from '../../application/use-cases/Herbarium/UpdateHerbariumType';
import { ToggleHerbariumTypeStatus } from '../../application/use-cases/Herbarium/ToggleHerbariumTypeStatus';
import { SoftDeleteHerbariumType } from '../../application/use-cases/Herbarium/SoftDeleteHerbariumType';
import { HerbariumTypeRepositoryImpl } from '../implementations/HerbariumTypeRepositoryImpl';
import { LogEventRepositoryImpl } from '../implementations/LogEventRepositoryImpl';
import { ApiResponse } from '../helpers/ApiResponse';

export class HerbariumTypeController {
    private getAllHerbariumTypesUseCase: GetAllHerbariumTypes;
    private createHerbariumTypeUseCase: CreateHerbariumType;
    private updateHerbariumTypeUseCase: UpdateHerbariumType;
    private toggleStatusUseCase: ToggleHerbariumTypeStatus;
    private softDeleteUseCase: SoftDeleteHerbariumType;

    constructor() {
        const herbariumRepo = new HerbariumTypeRepositoryImpl();
        const logEventRepo = new LogEventRepositoryImpl();
        
        this.getAllHerbariumTypesUseCase = new GetAllHerbariumTypes(herbariumRepo);
        this.createHerbariumTypeUseCase = new CreateHerbariumType(herbariumRepo, logEventRepo);
        this.updateHerbariumTypeUseCase = new UpdateHerbariumType(herbariumRepo, logEventRepo);
        this.toggleStatusUseCase = new ToggleHerbariumTypeStatus(herbariumRepo, logEventRepo);
        this.softDeleteUseCase = new SoftDeleteHerbariumType(herbariumRepo, logEventRepo);
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

    async updateHerbariumType(req: Request, res: Response): Promise<Response> {
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

            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                response.statusCode = 400;
                response.message = 'ID inválido';
                return res.status(response.statusCode).json(response);
            }

            const updateData = {
                name: req.body.name,
                description: req.body.description,
                status: req.body.status
            };

            const updatedHerbariumType = await this.updateHerbariumTypeUseCase.execute(
                id,
                updateData,
                req.user.userId
            );

            if (!updatedHerbariumType) {
                response.statusCode = 404;
                response.message = 'Tipo de herbario no encontrado';
                return res.status(response.statusCode).json(response);
            }

            response.message = 'Tipo de herbario actualizado exitosamente';
            response.data = updatedHerbariumType;
            return res.status(response.statusCode).json(response);

        } catch (error) {
            console.error(error);
            response.statusCode = 500;
            response.message = 'Error interno del servidor';
            return res.status(response.statusCode).json(response);
        }
    }

    async toggleHerbariumTypeStatus(req: Request, res: Response): Promise<Response> {
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

            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                response.statusCode = 400;
                response.message = 'ID inválido';
                return res.status(response.statusCode).json(response);
            }

            const updatedHerbariumType = await this.toggleStatusUseCase.execute(
                id,
                req.user.userId
            );

            if (!updatedHerbariumType) {
                response.statusCode = 404;
                response.message = 'Tipo de herbario no encontrado';
                return res.status(response.statusCode).json(response);
            }

            const action = updatedHerbariumType.status ? 'activado' : 'desactivado';
            response.message = `Tipo de herbario ${action} exitosamente`;
            response.data = updatedHerbariumType;
            return res.status(response.statusCode).json(response);

        } catch (error) {
            console.error(error);
            response.statusCode = 500;
            response.message = 'Error interno del servidor';
            return res.status(response.statusCode).json(response);
        }
    }

    async softDeleteHerbariumType(req: Request, res: Response): Promise<Response> {
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

            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                response.statusCode = 400;
                response.message = 'ID inválido';
                return res.status(response.statusCode).json(response);
            }

            const deletedHerbariumType = await this.softDeleteUseCase.execute(
                id,
                req.user.userId
            );

            if (!deletedHerbariumType) {
                response.statusCode = 404;
                response.message = 'Tipo de herbario no encontrado';
                return res.status(response.statusCode).json(response);
            }

            response.message = 'Tipo de herbario eliminado exitosamente';
            response.data = deletedHerbariumType;
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