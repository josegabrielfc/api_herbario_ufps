export interface PlantImg {
    id?: number;
    plant_id: number;
    image_url: string;
    description?: string;
    created_at?: Date;
    is_deleted: boolean;
}