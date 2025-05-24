import { Plant } from "./Plant";

export interface PlantPlantImg extends Plant {
    image_id: number;
    image_url: string;
}