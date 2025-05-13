import express from 'express';
import { plantImgController, upload } from '../controllers/PlantImgController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.post(
    '/plants/:plantId',
    authMiddleware,
    upload.single('image'),
    async (req, res) => {
        try {
            await plantImgController.uploadImage(req, res);
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }
);

router.get('/getImgPlantsById/:plantId', async (req, res) => {
    try {
        await plantImgController.getImagesByPlantId(req, res);
    } catch (error) {
        res.status(500).send({ error: 'Internal Server Error' });
    }
});


export default router;