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

router.put('/updateImage/:id',
    authMiddleware,
    upload.single('image'),
    async (req, res) => {
        try {
            await plantImgController.updateImage(req, res);
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
);

router.patch('/toggleImageStatus/:id',
    authMiddleware,
    async (req, res) => {
        try {
            await plantImgController.toggleImageStatus(req, res);
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
);

router.patch('/softDeleteImage/:id',
    authMiddleware,
    async (req, res) => {
        try {
            await plantImgController.softDeleteImage(req, res);
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
);

export default router;