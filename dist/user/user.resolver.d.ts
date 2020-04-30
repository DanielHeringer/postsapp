import { UserService } from "./user.service";
import { User } from "./user.interface";
export declare class UserResolver {
    private userService;
    constructor(userService: UserService);
    users(page?: number): Promise<any[]>;
    userByID(id: string): Promise<User>;
    userByUsername(username: string): Promise<User>;
    createUser(username: string, password: string): Promise<{
        _id: string;
        username: string;
        token: string;
    }>;
    updateUser(username: string, password: string, id: string): Promise<{
        _id: string;
        username: string;
        token: string;
    }>;
    login(username: string, password: string): Promise<{
        _id: string;
        username: string;
        token: string;
    }>;
}
