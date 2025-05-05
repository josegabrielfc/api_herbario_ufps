import express from 'express';
import { herbariumTypeController } from '../controllers/HerbariumTypeController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/home/getHerbariums', async (req, res) => {
    try {
        await herbariumTypeController.getAllHerbariumTypes(req, res);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

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

export default router;