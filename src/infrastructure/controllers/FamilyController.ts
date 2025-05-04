import { Request, Response } from 'express';
import { GetFamiliesByHerbariumType } from '../../application/use-cases/GetFamiliesByHerbariumType';
import { FamilyRepositoryImpl } from '../../infrastructure/implementations/FamilyRepositoryImpl';
import { ApiResponse } from '../helpers/ApiResponse';

const familyRepositoryImpl = new FamilyRepositoryImpl();
const getFamiliesByHerbariumTypeIdUseCase = new GetFamiliesByHerbariumType(familyRepositoryImpl);

export const getFamiliesByHerbariumTypeId = async (req: Request, res: Response): Promise<Response> => {
  const herbariumTypeId = parseInt(req.params.id);

  const response: ApiResponse = {
    statusCode: 200,
    message: '',
    timestamp: new Date().toISOString(),
    data: null
  };

  if (isNaN(herbariumTypeId)) {
    response.statusCode = 400;
    response.message = 'ID inválido';
    return res.status(response.statusCode).json(response);
  }

  try {
    const families = await getFamiliesByHerbariumTypeIdUseCase.execute(herbariumTypeId);

    if (!families || (Array.isArray(families) && families.length === 0)) {
      response.statusCode = 404;
      response.message = 'No se encontraron datos para el ID especificado';
      return res.status(response.statusCode).json(response);
    }

    response.statusCode = 200;
    response.message = 'Datos obtenidos exitosamente';
    response.data = families;
    return res.status(response.statusCode).json(response);

  } catch (error) {
    console.error(error);
    response.statusCode = 500;
    response.message = 'Error interno del servidor';
    return res.status(response.statusCode).json(response);
  }
};


