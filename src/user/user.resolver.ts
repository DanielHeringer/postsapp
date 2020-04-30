import { Resolver, Query, Mutation, Args } from "@nestjs/graphql";
import { UserService } from "./user.service";
import { User } from "./user.interface";

@Resolver('User')
export class UserResolver {

    constructor(private userService: UserService) {}

    @Query()
    users(@Args('page') page = 0){
        return this.userService.getAll(page)
    }
    
    @Query()
    userByID(@Args('id') id: string){
        return this.userService.getByID(id)
    }

    @Query()
    userByUsername(@Args('username') username: string){
        return this.userService.getByUsername(username)
    }

    @Mutation()
    createUser(
        @Args('username') username: string,
        @Args('password') password: string
    ) {
        const user: Partial<User> = {username, password}
        return this.userService.create(user)
    }
    
    @Mutation()
    updateUser(
        @Args('username') username: string,
        @Args('password') password: string,
        @Args('id') id: string
    ) {
        const user: Partial<User> = {username, password}
        return this.userService.update(user, id)
    }

    @Mutation()
    login(
        @Args('username') username: string,
        @Args('password') password: string
    ) {
        const user: Partial<User> = {username, password}
        return this.userService.login(user)
    }

}