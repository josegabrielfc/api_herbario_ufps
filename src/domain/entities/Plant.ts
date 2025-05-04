export interface Plant {
    id: number;
    family_id: number;
    common_name: string | null;
    scientific_name: string;
    quantity: number;
    description: string | null;
    status: boolean;
    is_deleted: boolean;
}