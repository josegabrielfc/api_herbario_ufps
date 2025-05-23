import { Request, Response } from "express";
import { CreateFamily } from "../../application/use-cases/Family/CreateFamily";
import { UpdateFamily } from "../../application/use-cases/Family/UpdateFamily";
import { ToggleFamilyStatus } from "../../application/use-cases/Family/ToggleFamilyStatus";
import { SoftDeleteFamily } from "../../application/use-cases/Family/SoftDeleteFamily";
import { FamilyRepositoryImpl } from "../implementations/FamilyRepositoryImpl";
import { LogEventRepositoryImpl } from "../implementations/LogEventRepositoryImpl";
import { ApiResponse } from "../helpers/ApiResponse";
import { GetFamiliesByHerbariumType } from "../../application/use-cases/Family/GetFamiliesByHerbariumType";

export class FamilyController {
  private createFamilyUseCase: CreateFamily;
  private getFamiliesByHerbariumTypeIdUseCase: GetFamiliesByHerbariumType;
  private updateFamilyUseCase: UpdateFamily;
  private toggleStatusUseCase: ToggleFamilyStatus;
  private softDeleteUseCase: SoftDeleteFamily;

  constructor() {
    const familyRepo = new FamilyRepositoryImpl();
    const logEventRepo = new LogEventRepositoryImpl();

    this.getFamiliesByHerbariumTypeIdUseCase = new GetFamiliesByHerbariumType(
      familyRepo
    );
    this.createFamilyUseCase = new CreateFamily(familyRepo, logEventRepo);
    this.updateFamilyUseCase = new UpdateFamily(familyRepo, logEventRepo);
    this.toggleStatusUseCase = new ToggleFamilyStatus(familyRepo, logEventRepo);
    this.softDeleteUseCase = new SoftDeleteFamily(familyRepo, logEventRepo);
  }

  async getFamiliesByHerbariumTypeId(
    req: Request,
    res: Response
  ): Promise<Response> {
    const herbariumTypeId = parseInt(req.params.id);

    const response: ApiResponse = {
      statusCode: 200,
      message: "",
      timestamp: new Date().toISOString(),
      data: null,
    };

    if (isNaN(herbariumTypeId)) {
      response.statusCode = 400;
      response.message = "ID inválido";
      return res.status(response.statusCode).json(response);
    }

    try {
      const families = req.user 
                ? await this.getFamiliesByHerbariumTypeIdUseCase.execute(herbariumTypeId)
                : await this.getFamiliesByHerbariumTypeIdUseCase.executeForUsers(herbariumTypeId);

      if (!families || (Array.isArray(families) && families.length === 0)) {
        response.statusCode = 404;
        response.message = "No se encontraron datos para el ID especificado";
        return res.status(response.statusCode).json(response);
      }

      response.statusCode = 200;
      response.message = "Datos obtenidos exitosamente";
      response.data = families;
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      response.statusCode = 500;
      response.message = "Error interno del servidor";
      return res.status(response.statusCode).json(response);
    }
  }

  async createFamily(req: Request, res: Response): Promise<Response> {
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

      const familyData = {
        herbarium_type_id: req.body.herbarium_type_id,
        name: req.body.name,
        description: req.body.description || null,
        status: true,
        is_deleted: false,
      };

      const newFamily = await this.createFamilyUseCase.execute(
        familyData,
        req.user.userId
      );

      response.message = "Familia creada exitosamente";
      response.data = newFamily;
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      response.statusCode = 500;
      response.message = "Error interno del servidor";
      return res.status(response.statusCode).json(response);
    }
  }

  async updateFamily(req: Request, res: Response): Promise<Response> {
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
        name: req.body.name,
        description: req.body.description,
        status: req.body.status,
      };

      const updatedFamily = await this.updateFamilyUseCase.execute(
        id,
        updateData,
        req.user.userId
      );

      if (!updatedFamily) {
        response.statusCode = 404;
        response.message = "Familia no encontrada";
        return res.status(response.statusCode).json(response);
      }

      response.message = "Familia actualizada exitosamente";
      response.data = updatedFamily;
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      response.statusCode = 500;
      response.message = "Error interno del servidor";
      return res.status(response.statusCode).json(response);
    }
  }

  async toggleFamilyStatus(req: Request, res: Response): Promise<Response> {
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

      const family = await this.toggleStatusUseCase.execute(
        id,
        req.user.userId
      );

      if (!family) {
        response.statusCode = 404;
        response.message = "Familia no encontrada";
        return res.status(response.statusCode).json(response);
      }

      const action = family.status ? "activada" : "desactivada";
      response.message = `Familia ${action} exitosamente`;
      response.data = family;
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      response.statusCode = 500;
      response.message = "Error interno del servidor";
      return res.status(response.statusCode).json(response);
    }
  }

  async softDeleteFamily(req: Request, res: Response): Promise<Response> {
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

      const family = await this.softDeleteUseCase.execute(id, req.user.userId);

      if (!family) {
        response.statusCode = 404;
        response.message = "Familia no encontrada";
        return res.status(response.statusCode).json(response);
      }

      response.message = "Familia eliminada exitosamente";
      response.data = family;
      return res.status(response.statusCode).json(response);
    } catch (error) {
      console.error(error);
      response.statusCode = 500;
      response.message = "Error interno del servidor";
      return res.status(response.statusCode).json(response);
    }
  }
}

export const familyController = new FamilyController();