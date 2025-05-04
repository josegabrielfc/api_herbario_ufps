import { Router } from 'express';
import { getAllPlantsController, getPlantByIdsController } from '../controllers/PlantController';
import { Request, Response } from 'express';

const router = Router();

router.get('/home/getPlants', async (req: Request, res: Response): Promise<void> => {
    try {
        await getAllPlantsController(req, res);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.get('/home/getPlantByIds/:herbariumTypeId/:familyId', async (req: Request, res: Response): Promise<void> => {
    try {
        await getPlantByIdsController(req, res);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

export default router;