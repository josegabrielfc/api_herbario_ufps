import { Family } from '../entities/Family';

export interface FamilyRepository {
    getByHerbariumTypeId(herbariumTypeId: number): Promise<Family[]>;
}  