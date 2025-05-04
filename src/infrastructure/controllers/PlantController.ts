import { Request, Response } from 'express';
import { GetAllPlants } from '../../application/use-cases/GetAllPlants';
import { GetPlantByIds } from '../../application/use-cases/GetPlantByIds';
import { PlantRepositoryImpl } from '../implementations/PlantRepositoryImpl';
import { ApiResponse } from '../helpers/ApiResponse';

const plantRepository = new PlantRepositoryImpl();
const getAllPlantsUseCase = new GetAllPlants(plantRepository);

export const getAllPlantsController = async (req: Request, res: Response): Promise<Response> => {
  const response: ApiResponse = {
    statusCode: 200,
    message: '',
    timestamp: new Date().toISOString(),
    data: null
  };

  try {
    const plants = await getAllPlantsUseCase.execute();

    if (!plants || (Array.isArray(plants) && plants.length === 0)) {
      response.statusCode = 404;
      response.message = 'No se encontraron plantas';
      return res.status(response.statusCode).json(response);
    }

    response.statusCode = 200;
    response.message = 'Plantas obtenidas exitosamente';
    response.data = plants;
    return res.status(response.statusCode).json(response);

  } catch (error) {
    console.error(error);
    response.statusCode = 500;
    response.message = 'Error al obtener las plantas';
    return res.status(response.statusCode).json(response);
  }
};

export const getPlantByIdsController = async (req: Request, res: Response): Promise<Response> => {
  const response: ApiResponse = {
    statusCode: 200,
    message: '',
    timestamp: new Date().toISOString(),
    data: null
  };

  const herbariumTypeId = parseInt(req.params.herbariumTypeId);
  const familyId = parseInt(req.params.familyId);

  if (isNaN(herbariumTypeId) || isNaN(familyId)) {
    response.statusCode = 400;
    response.message = 'IDs inválidos';
    return res.status(response.statusCode).json(response);
  }

  try {
    const getPlantByIdsUseCase = new GetPlantByIds(plantRepository);
    const plants = await getPlantByIdsUseCase.execute(herbariumTypeId, familyId);

    if (!plants || plants.length === 0) {
      response.statusCode = 404;
      response.message = 'No se encontraron plantas para los IDs especificados';
      return res.status(response.statusCode).json(response);
    }

    response.statusCode = 200;
    response.message = 'Plantas obtenidas exitosamente';
    response.data = plants;
    return res.status(response.statusCode).json(response);

  } catch (error) {
    console.error(error);
    response.statusCode = 500;
    response.message = 'Error interno del servidor';
    return res.status(response.statusCode).json(response);
  }
};
