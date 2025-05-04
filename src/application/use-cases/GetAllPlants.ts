import { Plant } from '../../domain/entities/Plant';
import { PlantRepository } from '../../domain/repositories/PlantRepository';

export class GetAllPlants {
  constructor(private plantRepository: PlantRepository) {}

  async execute(): Promise<Plant[]> {
    return this.plantRepository.getAll();
  }
}