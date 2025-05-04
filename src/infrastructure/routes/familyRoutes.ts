import { Router } from 'express';
import { getFamiliesByHerbariumTypeId } from '../controllers/FamilyController';

const router = Router();

router.get('/getFamiliesById/:id', async (req, res) => {
    try {
        await getFamiliesByHerbariumTypeId(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

export default router;
