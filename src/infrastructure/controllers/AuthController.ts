import { Request, Response } from 'express';
import { LoginUser } from '../../application/use-cases/Auth/LoginUser';
import { CreateUser } from '../../application/use-cases/Auth/CreateUser';
import { UpdateUserPassword } from '../../application/use-cases/Auth/UpdateUserPassword';
import { UserRepositoryImpl } from '../implementations/UserRepositoryImpl';
import { ApiResponse } from '../helpers/ApiResponse';
import { UserRepository } from '../../domain/repositories/UserRepository';
import { SendForgotPasswordCode } from '../../application/use-cases/Auth/SendForgotPasswordCode';
import { EmailService } from '../services/EmailService';
import { ValidateForgotPasswordCode } from '../../application/use-cases/Auth/ValidateForgotPasswordCode';




export class AuthController {
    private loginUserUseCase: LoginUser;
    private createUserUseCase: CreateUser;
    private updatePasswordUseCase: UpdateUserPassword;
    private sendForgotPasswordCodeUseCase: SendForgotPasswordCode;
    private validateForgotPasswordCodeUseCase: ValidateForgotPasswordCode;
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepositoryImpl();
        this.loginUserUseCase = new LoginUser(this.userRepository);
        this.createUserUseCase = new CreateUser(this.userRepository);
        this.updatePasswordUseCase = new UpdateUserPassword(this.userRepository);
        this.validateForgotPasswordCodeUseCase = new ValidateForgotPasswordCode(this.userRepository);
        
        const emailService = new EmailService();
        this.sendForgotPasswordCodeUseCase = new SendForgotPasswordCode(
            this.userRepository,
            emailService
        );
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
            const result = await this.loginUserUseCase.execute(email, password);

            if (!result || !result.success) {
                response.statusCode = 401;
                response.message = result?.message || 'Credenciales inválidas';
                return res.status(response.statusCode).json(response);
            }

            response.message = 'Login successful';
            response.data = {
                token: result.data?.token,
                user: result.data?.user
            };
            return res.status(response.statusCode).json(response);

        } catch (error) {
            console.error(error);
            response.statusCode = 500;
            response.message = 'Error interno del servidor';
            return res.status(response.statusCode).json(response);
        }
    }

    async logout(req: Request, res: Response) {
        try {
            const userId = req.user?.userId;
            
            // Eliminar el token de la base de datos
            await this.userRepository.updateUserToken(userId!, '');
            
            res.json({ 
                success: true, 
                message: 'Sesión cerrada correctamente' 
            });
        } catch (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error al cerrar sesión' 
            });
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
            const { newPassword } = req.body;
            const userId = req.user?.userId;

            if (!userId) {
                response.statusCode = 401;
                response.message = 'Usuario no autenticado';
                return res.status(response.statusCode).json(response);
            }

            const success = await this.updatePasswordUseCase.execute(
                userId,
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

    async sendForgotPasswordCode(req: Request, res: Response): Promise<Response> {
        const response: ApiResponse = {
            statusCode: 200,
            message: '',
            timestamp: new Date().toISOString(),
            data: null
        };

        try {
            const { email } = req.body;

            if (!email) {
                response.statusCode = 400;
                response.message = 'El correo electrónico es requerido';
                return res.status(response.statusCode).json(response);
            }

            const success = await this.sendForgotPasswordCodeUseCase.execute(email);

            if (!success) {
                response.statusCode = 404;
                response.message = 'Correo electrónico no encontrado';
                return res.status(response.statusCode).json(response);
            }

            response.message = 'Código enviado exitosamente';
            return res.status(response.statusCode).json(response);

        } catch (error) {
            console.error(error);
            response.statusCode = 500;
            response.message = 'Error interno del servidor';
            return res.status(response.statusCode).json(response);
        }
    }

    async validateCode(req: Request, res: Response): Promise<Response> {
        const response: ApiResponse = {
            statusCode: 200,
            message: '',
            timestamp: new Date().toISOString(),
            data: null
        };

        try {
            const { email, code } = req.body;

            if (!email || !code) {
                response.statusCode = 400;
                response.message = 'Email y código son requeridos';
                return res.status(response.statusCode).json(response);
            }

            const isValid = await this.validateForgotPasswordCodeUseCase.execute(email, code);

            if (!isValid) {
                response.statusCode = 400;
                response.message = 'Código inválido';
                return res.status(response.statusCode).json(response);
            }

            response.message = 'Código validado exitosamente';
            response.data = {
                token: isValid.data?.token,
                user: isValid.data?.user
            };
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