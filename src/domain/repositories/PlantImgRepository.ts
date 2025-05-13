import { PlantImg } from '../entities/PlantImg';

export interface PlantImgRepository {
    create(plantImg: Omit<PlantImg, 'id' | 'created_at'>): Promise<PlantImg>;
    getByPlantId(plantId: number): Promise<PlantImg[]>;
    getImgsByPlantId(plantId: number): Promise<PlantImg[]>;
}