import nodemailer, { Transporter } from 'nodemailer';
import { env } from '../../config/env';

export class EmailService {
    private transporter: Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: env.emailHost,
            port: env.emailPort,
            secure: true,
            auth: {
                user: env.emailUser,
                pass: env.emailPassword
            }
        });
    }

    async sendForgotPasswordCode(email: string, code: string): Promise<boolean> {
        try {
            if (!env.emailUser || !env.emailPassword) {
                console.error('Email configuration is missing');
                return false;
            }

            await this.transporter.sendMail({
                from: env.emailUser,
                to: email,
                subject: 'Código de recuperación de contraseña',
                html: `
                    <h1>Recuperación de contraseña</h1>
                    <p>Tu código de recuperación es: <strong>${code}</strong></p>
                    <p>Este código expirará en 15 minutos.</p>
                `
            });
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }
}