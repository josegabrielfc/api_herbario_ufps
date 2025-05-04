import { Plant } from '../entities/Plant';

export interface PlantRepository {
  getAll(): Promise<Plant[]>;
  getByIds(herbariumTypeId: number, familyId: number): Promise<Plant[]>;
}
