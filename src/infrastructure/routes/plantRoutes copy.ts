import { Router } from 'express';
import { 
  getAllPlantsController, 
  getPlantByIdsController,
//   createPlantController,
//   updatePlantController,
//   deletePlantController
} from '../controllers/PlantController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

// Rutas públicas (sin autenticación)
router.get('/home/getPlants', async (req, res) => {
    try {
        await getAllPlantsController(req, res);
    } catch (error) {
        res.status(500).json({ 
            statusCode: 500,
            message: 'Error interno del servidor',
            timestamp: new Date().toISOString(),
            data: null
        });
    }
});

router.get('/home/getPlantByIds/:herbariumTypeId/:familyId', async (req, res) => {
    try {
        await getPlantByIdsController(req, res);
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            message: 'Error interno del servidor',
            timestamp: new Date().toISOString(),
            data: null
        });
    }
});

// Rutas protegidas (requieren autenticación)
// router.post('/plants', authMiddleware, (req, res) => {
//     const userId = req.user?.userId;
//     const roleId = req.user?.roleId;
//     // req.body.userId = userId;
//     // req.body.roleId = roleId;
//          createPlantController(req, res).then(() => {
//             res.status(200).json({
//                 statusCode: 200,
//                 message: 'Planta creada exitosamente',
//                 timestamp: new Date().toISOString(),
//                 data: null
//             });
//          }).catch(() => {
//             res.status(500).json({
//                 statusCode: 500,
//                 message: 'Error al crear la planta',
//                 timestamp: new Date().toISOString(),
//                 data: null
//             });
//          })
//     });

// router.put('/plants/:id', authMiddleware, async (req, res) => {
//     try {
//         await updatePlantController(req, res);
//     } catch (error) {
//         res.status(500).json({
//             statusCode: 500,
//             message: 'Error al actualizar la planta',
//             timestamp: new Date().toISOString(),
//             data: null
//         });
//     }
// });

// router.delete('/plants/:id', authMiddleware, async (req, res) => {
//     try {
//         await deletePlantController(req, res);
//     } catch (error) {
//         res.status(500).json({
//             statusCode: 500,
//             message: 'Error al eliminar la planta',
//             timestamp: new Date().toISOString(),
//             data: null
//         });
//     }
// });

export default router;