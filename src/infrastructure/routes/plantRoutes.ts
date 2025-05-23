import { Router } from 'express';
import { plantController } from '../controllers/PlantController';
import { Request, Response } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/home/getPlants', 
    async (req, res, next) => {
            try {
                // Si hay token, pasa por el middleware
                if (req.headers.authorization) {
                    return authMiddleware(req, res, next);
                }
                // Si no hay token, continúa como usuario normal
                return next();
            } catch (error) {
                res.status(500).json({ message: 'Error interno del servidor' });
            }
        },
        async (req, res) => {
            try {
                await plantController.getAllPlants(req, res);
            } catch (error) {
                res.status(500).json({ message: 'Error interno del servidor' });
            }
        }
);

router.get('/home/getPlantByIds/:herbariumTypeId/:familyId',
    async (req, res, next) => {
        try {
            // Si hay token, pasa por el middleware
            if (req.headers.authorization) {
                return authMiddleware(req, res, next);
            }
            // Si no hay token, continúa como usuario normal
            return next();
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
    async (req, res) => {
        try {
            await plantController.getPlantByIds(req, res);
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
);

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