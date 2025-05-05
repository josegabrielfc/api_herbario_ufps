import { HerbariumType } from '../entities/HerbariumType';

export interface HerbariumTypeRepository {
  getAll(): Promise<HerbariumType[]>;
  create(herbariumType: Omit<HerbariumType, 'id'>): Promise<HerbariumType>;
}