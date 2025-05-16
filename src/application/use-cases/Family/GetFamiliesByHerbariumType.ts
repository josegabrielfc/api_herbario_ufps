import { Family } from '../../../domain/entities/Family';
import { FamilyRepository } from '../../../domain/repositories/FamilyRepository';

export class GetFamiliesByHerbariumType {
  constructor(private readonly familyRepo: FamilyRepository) {}

  async execute(herbariumTypeId: number): Promise<Family[]> {
    return this.familyRepo.findByHerbariumTypeId(herbariumTypeId);
  }
}
