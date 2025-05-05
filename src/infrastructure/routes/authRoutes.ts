import express from "express";
import { authController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/login", async (req, res) => {
    try {
        await authController.login(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.post("/register", authMiddleware, async (req, res) => {
    try {
        await authController.createUser(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

router.put("/update-password", authMiddleware, async (req, res) => {
    try {
        await authController.updatePassword(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

export default router;
