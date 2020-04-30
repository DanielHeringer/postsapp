import { Model } from 'mongoose';
import { User } from './user.interface';
export declare class UserService {
    private userModel;
    constructor(userModel: Model<User>);
    getAll(page?: number): Promise<any[]>;
    getByID(id: string): Promise<User>;
    getByUsername(username: string): Promise<User>;
    create(user: Partial<User>): Promise<{
        _id: string;
        username: string;
        token: string;
    }>;
    update(user: Partial<User>, id: string): Promise<{
        _id: string;
        username: string;
        token: string;
    }>;
    pushPost(idPost: string, idUser: string): Promise<User>;
    removePost(idPost: string, idUser: string): Promise<User>;
    login(user: Partial<User>): Promise<{
        _id: string;
        username: string;
        token: string;
    }>;
    getToken(user: Partial<User>): string;
    toResponseObject(user: Partial<User>): {
        _id: string;
        username: string;
        token: string;
    };
    encryptPassword(user: Partial<User>): Promise<string>;
    comparePassword(_password: string, user: Partial<User>): Promise<boolean>;
}
