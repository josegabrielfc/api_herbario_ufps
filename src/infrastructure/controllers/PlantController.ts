import { Request, Response } from "express";
import { GetAllPlants } from "../../application/use-cases/Plants/GetAllPlants";
import { GetPlantByIds } from "../../application/use-cases/Plants/GetPlantByIds";
import { PlantRepositoryImpl } from "../implementations/PlantRepositoryImpl";
import { ApiResponse } from "../helpers/ApiResponse";
import { CreatePlant } from "../../application/use-cases/Plants/CreatePlant";
import { UpdatePlant } from "../../application/use-cases/Plants/UpdatePlant";
import { TogglePlantStatus } from "../../application/use-cases/Plants/TogglePlantStatus";
import { SoftDeletePlant } from "../../application/use-cases/Plants/SoftDeletePlant";
import { LogEventRepositoryImpl } from "../implementations/LogEventRepositoryImpl";

export class PlantController {
  private plantRepository: PlantRepositoryImpl;
  private logEventRepository: LogEventRepositoryImpl;
  private getAllPlantsUseCase: GetAllPlants;
  private getPlantByIdsUseCase: GetPlantByIds;
  private createPlantUseCase: CreatePlant;
  private updatePlantUseCase: UpdatePlant;
  private toggleStatusUseCase: TogglePlantStatus;
  private softDeleteUseCase: SoftDeletePlant;

  constructor() {
    this.logEventRepository = new LogEventRepositoryImpl();
    this.plantRepository = new PlantRepositoryImpl();

    this.getAllPlantsUseCase = new GetAllPlants(this.plantRepository);
    this.getPlantByIdsUseCase = new GetPlantByIds(this.plantRepository);
    this.createPlantUseCase = new CreatePlant(this.plantRepository, this.logEventRepository);
    this.updatePlantUseCase = new UpdatePlant(this.plantRepository, this.logEventRepository);
    this.toggleStatusUseCase = new TogglePlantStatus(this.plantRepository, this.logEventRepository);
    this.softDeleteUseCase = new SoftDeletePlant(this.plantRepository, this.logEventRepository);
  }

  public async getAllPlants(req: Request, res: Response): Promise<Response> {
    const response: ApiResponse = {
      statusCode: 200,
      message: "",
      timestamp: new Date().toISOString(),
      data: null,
    };

    try {
      console.error("Obteniendo todas las plantas: ", req.user ? "Usuario autenticado" : "Usuario no autenticado");
      const plants = req.user 
              ? await this.getAllPlantsUseCase.execute()
              : await this.getAllPlantsUseCase.executeForUsers();

      if (!plants || (Array.isArray(plants) && plants.length === 0)) {
        response.statusCode = 404;
        response.message = "No se encontraron plantas";
        return res.status(response.statusCode).json(response);
      }

      response.statusCode = 200;
      response.message = "Plantas obtenidas exitosamente";
      response.data = plants;
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      response.statusCode = 500;
      response.message = "Error al obtener las plantas";
      return res.status(response.statusCode).json(response);
    }
  }

  public async getPlantByIds(req: Request, res: Response): Promise<Response> {
    const response: ApiResponse = {
      statusCode: 200,
      message: "",
      timestamp: new Date().toISOString(),
      data: null,
    };

    const herbariumTypeId = parseInt(req.params.herbariumTypeId);
    const familyId = parseInt(req.params.familyId);

    if (isNaN(herbariumTypeId) || isNaN(familyId)) {
      response.statusCode = 400;
      response.message = "IDs inválidos";
      return res.status(response.statusCode).json(response);
    }

    try {

      const plants = req.user 
              ? await this.getPlantByIdsUseCase.execute(herbariumTypeId, familyId)
              : await this.getPlantByIdsUseCase.executeForUsers(herbariumTypeId, familyId);

      if (!plants || plants.length === 0) {
        response.statusCode = 404;
        response.message =
          "No se encontraron plantas para los IDs especificados";
        return res.status(response.statusCode).json(response);
      }

      response.statusCode = 200;
      response.message = "Plantas obtenidas exitosamente";
      response.data = plants;
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      response.statusCode = 500;
      response.message = "Error interno del servidor";
      return res.status(response.statusCode).json(response);
    }
  }
  async createPlant(req: Request, res: Response): Promise<Response> {
    const response: ApiResponse = {
      statusCode: 200,
      message: "",
      timestamp: new Date().toISOString(),
      data: null,
    };

    try {
      if (!req.user) {
        response.statusCode = 401;
        response.message = "Usuario no autenticado";
        return res.status(response.statusCode).json(response);
      }

      const plantData = {
        family_id: req.body.family_id,
        common_name: req.body.common_name || null,
        scientific_name: req.body.scientific_name,
        quantity: req.body.quantity,
        description: req.body.description || null,
        status: true,
        is_deleted: false,
        refs: req.body.refs || null
      };

      const newPlant = await this.createPlantUseCase.execute(
        plantData,
        req.user.userId
      );

      response.message = "Planta creada exitosamente";
      response.data = newPlant;
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      response.statusCode = 500;
      response.message = "Error interno del servidor";
      return res.status(response.statusCode).json(response);
    }
  }
  async updatePlant(req: Request, res: Response): Promise<Response> {
    const response: ApiResponse = {
      statusCode: 200,
      message: "",
      timestamp: new Date().toISOString(),
      data: null,
    };

    try {
      if (!req.user) {
        response.statusCode = 401;
        response.message = "Usuario no autenticado";
        return res.status(response.statusCode).json(response);
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        response.statusCode = 400;
        response.message = "ID inválido";
        return res.status(response.statusCode).json(response);
      }

      const updateData = {
        common_name: req.body.common_name,
        scientific_name: req.body.scientific_name,
        quantity: req.body.quantity,
        description: req.body.description,
        refs: req.body.refs
      };

      const updatedPlant = await this.updatePlantUseCase.execute(
        id,
        updateData,
        req.user.userId
      );

      if (!updatedPlant) {
        response.statusCode = 404;
        response.message = "Planta no encontrada";
        return res.status(response.statusCode).json(response);
      }

      response.message = "Planta actualizada exitosamente";
      response.data = updatedPlant;
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      response.statusCode = 500;
      response.message = "Error interno del servidor";
      return res.status(response.statusCode).json(response);
    }
  }

  async togglePlantStatus(req: Request, res: Response): Promise<Response> {
    const response: ApiResponse = {
      statusCode: 200,
      message: "",
      timestamp: new Date().toISOString(),
      data: null,
    };

    try {
      if (!req.user) {
        response.statusCode = 401;
        response.message = "Usuario no autenticado";
        return res.status(response.statusCode).json(response);
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        response.statusCode = 400;
        response.message = "ID inválido";
        return res.status(response.statusCode).json(response);
      }

      const plant = await this.toggleStatusUseCase.execute(id, req.user.userId);

      if (!plant) {
        response.statusCode = 404;
        response.message = "Planta no encontrada";
        return res.status(response.statusCode).json(response);
      }

      const action = plant.status ? "activada" : "desactivada";
      response.message = `Planta ${action} exitosamente`;
      response.data = plant;
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      response.statusCode = 500;
      response.message = "Error interno del servidor";
      return res.status(response.statusCode).json(response);
    }
  }

  async softDeletePlant(req: Request, res: Response): Promise<Response> {
    const response: ApiResponse = {
      statusCode: 200,
      message: "",
      timestamp: new Date().toISOString(),
      data: null,
    };

    try {
      if (!req.user) {
        response.statusCode = 401;
        response.message = "Usuario no autenticado";
        return res.status(response.statusCode).json(response);
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        response.statusCode = 400;
        response.message = "ID inválido";
        return res.status(response.statusCode).json(response);
      }

      const plant = await this.softDeleteUseCase.execute(id, req.user.userId);

      if (!plant) {
        response.statusCode = 404;
        response.message = "Planta no encontrada";
        return res.status(response.statusCode).json(response);
      }

      response.message = "Planta eliminada exitosamente";
      response.data = plant;
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      response.statusCode = 500;
      response.message = "Error interno del servidor";
      return res.status(response.statusCode).json(response);
    }
  }
}

export const plantController = new PlantController();