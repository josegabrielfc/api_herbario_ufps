import { HerbariumType } from '../entities/HerbariumType';

export interface HerbariumTypeRepository {
  getAll(): Promise<HerbariumType[]>;
  create(herbariumType: Omit<HerbariumType, 'id'>): Promise<HerbariumType>;
  update(id: number, data: Partial<HerbariumType>): Promise<HerbariumType | null>;
  toggleStatus(id: number): Promise<HerbariumType | null>;
  softDelete(id: number): Promise<HerbariumType | null>;
}