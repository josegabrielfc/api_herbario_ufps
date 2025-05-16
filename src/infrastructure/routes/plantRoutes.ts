import { Router } from 'express';
import { plantController } from '../controllers/PlantController';
import { Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/home/getPlants', async (req: Request, res: Response): Promise<void> => {
    try {
        await plantController.getAllPlants(req, res);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.get('/home/getPlantByIds/:herbariumTypeId/:familyId', async (req: Request, res: Response): Promise<void> => {
    try {
        await plantController.getPlantByIds(req, res);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

router.post('/createPlant', 
    authMiddleware, 
    async (req, res) => {
        try {
            await plantController.createPlant(req, res);
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
);

router.put('/updatePlant/:id',
    authMiddleware,
    async (req, res) => {
        try {
            await plantController.updatePlant(req, res);
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
);

router.patch('/togglePlantStatus/:id',
    authMiddleware,
    async (req, res) => {
        try {
            await plantController.togglePlantStatus(req, res);
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
);

router.patch('/softDeletePlant/:id',
    authMiddleware,
    async (req, res) => {
        try {
            await plantController.softDeletePlant(req, res);
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
);
export default router;