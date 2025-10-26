export interface User {
    id: number;
    name: string;
    email: string;
    password_hash: string;
    created_at: Date;
    updated_at: Date;
}
export interface CreateUserData {
    name: string;
    email: string;
    password: string;
}
export interface UserResponse {
    id: number;
    name: string;
    email: string;
    created_at: Date;
    updated_at: Date;
}
export declare class UserModel {
    static create(userData: CreateUserData): Promise<UserResponse>;
    static findByEmail(email: string): Promise<User | null>;
    static findById(id: number): Promise<UserResponse | null>;
    static verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean>;
    static updateProfile(id: number, updates: Partial<Pick<User, 'name' | 'email'>>): Promise<UserResponse>;
    static changePassword(id: number, newPassword: string): Promise<void>;
}
//# sourceMappingURL=User.d.ts.map