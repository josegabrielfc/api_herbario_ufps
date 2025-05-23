import { HerbariumType } from '../../../domain/entities/HerbariumType';
import { HerbariumTypeRepository } from '../../../domain/repositories/HerbariumTypeRepository';

export class GetAllHerbariumTypes {
  constructor(private herbariumTypeRepository: HerbariumTypeRepository) {}

  async execute(): Promise<HerbariumType[]> {
    return this.herbariumTypeRepository.getAll();
  }

  async executeForUsers(): Promise<HerbariumType[]> {
    return this.herbariumTypeRepository.getAllForUsers();
  }
}
