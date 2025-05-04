import express from 'express';
import { getAllHerbariumTypesController } from '../controllers/HerbariumTypeController';

const router = express.Router();

router.get('/home/getHerbariums', async (req, res) => {
    try {
        await getAllHerbariumTypesController(req, res);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

export default router;