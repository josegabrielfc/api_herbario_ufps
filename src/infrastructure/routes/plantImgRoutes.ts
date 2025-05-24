import express from 'express';
import { plantImgController, upload } from '../controllers/PlantImgController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/getAllPlantImages',
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
            await plantImgController.getAllPlantImages(req, res);
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
);

router.post(
    '/plants/:plantId',
    authMiddleware,
    upload.array('images', 3),
    async (req, res) => {
        try {
            await plantImgController.uploadImages(req, res);
        } catch (error) {
            res.status(500).send({ error: 'Internal Server Error' });
        }
    }
);

router.get('/getImgPlantsById/:plantId',
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
            await plantImgController.getImagesByPlantId(req, res);
        } catch (error) {
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    }
);

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