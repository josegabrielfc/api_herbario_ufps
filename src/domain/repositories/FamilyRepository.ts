import { Family } from '../entities/Family';

export interface FamilyRepository {
    findByHerbariumTypeId(herbariumTypeId: number): Promise<Family[]>;
    findById(id: number): Promise<Family | null>;
    create(family: Omit<Family, 'id'>): Promise<Family>;
    update(id: number, family: Partial<Family>): Promise<Family | null>;
    toggleStatus(id: number): Promise<Family | null>;
    softDelete(id: number): Promise<Family | null>;
}  