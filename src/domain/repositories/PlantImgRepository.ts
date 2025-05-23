import { PlantImg } from '../entities/PlantImg';

export interface PlantImgRepository {
    create(plantImg: Omit<PlantImg, 'id' | 'created_at'>): Promise<PlantImg>;
    getByPlantId(plantId: number): Promise<PlantImg[]>;
    getByPlantIdForUsers(plantId: number): Promise<PlantImg[]>;
    getImgsByPlantId(plantId: number): Promise<PlantImg[]>;
    findById(id: number): Promise<PlantImg | null>;
    update(id: number, plantImg: Partial<PlantImg>): Promise<PlantImg | null>;
    toggleStatus(id: number): Promise<PlantImg | null>;
    softDelete(id: number): Promise<PlantImg | null>;
    countImagesByPlantId(plantId: number): Promise<number>;
    createMultiple(plantImgs: Array<Omit<PlantImg, 'id' | 'created_at'>>): Promise<PlantImg[]>;
}