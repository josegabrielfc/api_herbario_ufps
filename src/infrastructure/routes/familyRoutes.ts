import { Router } from 'express';
import { familyController } from '../controllers/FamilyController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.get('/getFamiliesById/:id', async (req, res) => {
    try {
        await familyController.getFamiliesByHerbariumTypeId(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

router.post('/createFamily', 
    authMiddleware, 
    async (req, res) => {
        try {
            await familyController.createFamily(req, res);
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
);

router.put('/updateFamily/:id',
    authMiddleware,
    async (req, res) => {
        try {
            await familyController.updateFamily(req, res);
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
);

router.patch('/toggleFamilyStatus/:id',
    authMiddleware,
    async (req, res) => {
        try {
            await familyController.toggleFamilyStatus(req, res);
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
);

router.patch('/softDeleteFamily/:id',
    authMiddleware,
    async (req, res) => {
        try {
            await familyController.softDeleteFamily(req, res);
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
);

export default router;
