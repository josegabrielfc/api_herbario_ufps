import { Plant } from '../entities/Plant';

export interface PlantRepository {
  getAll(): Promise<Plant[]>;
  getByIds(herbariumTypeId: number, familyId: number): Promise<Plant[]>;
  create(plant: Omit<Plant, 'id'>): Promise<Plant>;
  update(id: number, plant: Partial<Plant>): Promise<Plant | null>;
  toggleStatus(id: number): Promise<Plant | null>;
  softDelete(id: number): Promise<Plant | null>;
}
