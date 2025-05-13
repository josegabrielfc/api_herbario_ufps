import { Request, Response } from 'express';
import { LoginUser } from '../../application/use-cases/Auth/LoginUser';
import { CreateUser } from '../../application/use-cases/Auth/CreateUser';
import { UpdateUserPassword } from '../../application/use-cases/Auth/UpdateUserPassword';
import { UserRepositoryImpl } from '../implementations/UserRepositoryImpl';
import { ApiResponse } from '../helpers/ApiResponse';

export class AuthController {
    private loginUserUseCase: LoginUser;
    private createUserUseCase: CreateUser;
    private updatePasswordUseCase: UpdateUserPassword;

    constructor() {
        const userRepo = new UserRepositoryImpl();
        this.loginUserUseCase = new LoginUser(userRepo);
        this.createUserUseCase = new CreateUser(userRepo);
        this.updatePasswordUseCase = new UpdateUserPassword(userRepo);
    }

    async login(req: Request, res: Response): Promise<Response> {
        const response: ApiResponse = {
            statusCode: 200,
            message: '',
            timestamp: new Date().toISOString(),
            data: null
        };

        try {
            const { email, password } = req.body;
            const token = await this.loginUserUseCase.execute(email, password);

            if (!token) {
                response.statusCode = 401;
                response.message = 'Invalid credentials';
                return res.status(response.statusCode).json(response);
            }

            response.message = 'Login successful';
            response.data = { token };
            return res.status(response.statusCode).json(response);

        } catch (error) {
            console.error(error);
            response.statusCode = 500;
            response.message = 'Error interno del servidor';
            return res.status(response.statusCode).json(response);
        }
    }

    async createUser(req: Request, res: Response): Promise<Response> {
        const response: ApiResponse = {
            statusCode: 200,
            message: '',
            timestamp: new Date().toISOString(),
            data: null
        };

        try {
            console.log('Request body:', req.body); // Debug log

            if (!req.body || !req.body.email || !req.body.password || !req.body.name || !req.body.role_id) {
                response.statusCode = 400;
                response.message = 'Faltan campos requeridos';
                return res.status(response.statusCode).json(response);
            }

            const userData = {
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                role_id: req.body.role_id
            };

            const newUser = await this.createUserUseCase.execute(userData);

            if (!newUser) {
                response.statusCode = 400;
                response.message = 'El email ya está registrado';
                return res.status(response.statusCode).json(response);
            }

            response.message = 'Usuario creado exitosamente';
            response.data = { ...newUser, password: undefined };
            return res.status(response.statusCode).json(response);

        } catch (error) {
            console.error('Create user error:', error);
            response.statusCode = 500;
            response.message = 'Error interno del servidor';
            return res.status(response.statusCode).json(response);
        }
    }

    async updatePassword(req: Request, res: Response): Promise<Response> {
        const response: ApiResponse = {
            statusCode: 200,
            message: '',
            timestamp: new Date().toISOString(),
            data: null
        };

        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                response.statusCode = 401;
                response.message = 'Usuario no autenticado';
                return res.status(response.statusCode).json(response);
            }

            const success = await this.updatePasswordUseCase.execute(
                userId,
                currentPassword,
                newPassword
            );

            if (!success) {
                response.statusCode = 400;
                response.message = 'Contraseña actual incorrecta';
                return res.status(response.statusCode).json(response);
            }

            response.message = 'Contraseña actualizada exitosamente';
            return res.status(response.statusCode).json(response);

        } catch (error) {
            console.error(error);
            response.statusCode = 500;
            response.message = 'Error interno del servidor';
            return res.status(response.statusCode).json(response);
        }
    }
}

export const authController = new AuthController();