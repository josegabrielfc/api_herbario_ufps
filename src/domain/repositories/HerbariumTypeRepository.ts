import { HerbariumType } from '../entities/HerbariumType';

export interface HerbariumTypeRepository {
  getAll(): Promise<HerbariumType[]>;
}