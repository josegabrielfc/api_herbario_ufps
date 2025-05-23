import { Plant } from '../../../domain/entities/Plant';
import { PlantRepository } from '../../../domain/repositories/PlantRepository';

export class GetPlantByIds {
  constructor(private plantRepository: PlantRepository) {}

  async execute(herbariumTypeId: number, familyId: number): Promise<Plant[]> {
    return this.plantRepository.getByIds(herbariumTypeId, familyId);
  }
  
  async executeForUsers(herbariumTypeId: number, familyId: number): Promise<Plant[]> {
    return this.plantRepository.getByIdsForUsers(herbariumTypeId, familyId);
  }
}