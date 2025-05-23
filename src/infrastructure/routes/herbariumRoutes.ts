import express from 'express';
import { herbariumTypeController } from '../controllers/HerbariumTypeController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/home/getHerbariums',
    async (req, res, next) => {
        try {
            // Si hay token, pasa por el middleware
            if (req.headers.authorization) {
                return authMiddleware(req, res, next);
            }
            // Si no hay token, continúa como usuario normal
            return next();
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    },
    async (req, res) => {
        try {
            await herbariumTypeController.getAllHerbariumTypes(req, res);
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }
);

router.post('/home/createHerbarium', 
    authMiddleware, 
    async (req, res) => {
        try {
            await herbariumTypeController.createHerbariumType(req, res);
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }
);

router.put('/home/updateHerbarium/:id', 
    authMiddleware, 
    async (req, res) => {
        try {
            await herbariumTypeController.updateHerbariumType(req, res);
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }
);

// Cambio de estado de un herbario (activar/desactivar)
router.patch('/home/toggleHerbariumStatus/:id', 
    authMiddleware, 
    async (req, res) => {
        try {
            await herbariumTypeController.toggleHerbariumTypeStatus(req, res);
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }
);

// Soft Delete endpoint
router.patch('/home/softDelete/:id',
    authMiddleware, 
    async (req, res) => {
        try {
            await herbariumTypeController.softDeleteHerbariumType(req, res);
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }
);

export default router;