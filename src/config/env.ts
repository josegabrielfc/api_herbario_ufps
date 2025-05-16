import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL || '',
  emailHost: process.env.EMAIL_HOST || 'smtp.gmail.com',
  emailPort: parseInt(process.env.EMAIL_PORT || '465'),
  emailUser: process.env.EMAIL_USER || '',
  emailPassword: process.env.EMAIL_PASSWORD || '',
};