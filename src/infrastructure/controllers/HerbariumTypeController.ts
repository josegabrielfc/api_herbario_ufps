import { Request, Response } from 'express';
import { GetAllHerbariumTypes } from '../../application/use-cases/GetAllHerbariumTypes';
import { HerbariumTypeRepositoryImpl } from '../implementations/HerbariumTypeRepositoryImpl';
import { ApiResponse } from '../helpers/ApiResponse';

const herbariumRepo = new HerbariumTypeRepositoryImpl();
const getAllHerbariumTypesUseCase = new GetAllHerbariumTypes(herbariumRepo);

export const getAllHerbariumTypesController = async (req: Request, res: Response): Promise<Response> => {
  const response: ApiResponse = {
    statusCode: 200,
    message: '',
    timestamp: new Date().toISOString(),
    data: null
  };

  try {
    const herbariums = await getAllHerbariumTypesUseCase.execute();

    if (!herbariums || (Array.isArray(herbariums) && herbariums.length === 0)) {
      response.statusCode = 404;
      response.message = 'No se encontraron tipos de herbario';
      return res.status(response.statusCode).json(response);
    }

    response.statusCode = 200;
    response.message = 'Tipos de herbario obtenidos exitosamente';
    response.data = herbariums;
    return res.status(response.statusCode).json(response);

  } catch (error) {
    console.error(error);
    response.statusCode = 500;
    response.message = 'Error interno del servidor';
    return res.status(response.statusCode).json(response);
  }
};