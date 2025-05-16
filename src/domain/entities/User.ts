export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role_id: number;
    created_at: Date;
    token?: string;
}