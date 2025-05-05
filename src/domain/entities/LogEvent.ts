export interface LogEvent {
    id?: number;
    user_id: number;
    herbarium_type_id?: number;
    family_id?: number;
    plant_id?: number;
    plant_img_id?: number;
    description: string;
    created_at?: Date;
}