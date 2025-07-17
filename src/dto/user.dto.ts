export interface UserDTO {
    name: string;
    email: string;
    password: string;
    role: 'user' | 'admin';
    createdAt: Date;
}