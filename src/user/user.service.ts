import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken'
import * as bcrypt from 'bcryptjs'

import { User } from './user.interface';

@Injectable()
export class UserService {

    constructor(
        @Inject('USER_MODEL')
        private userModel: Model<User>,
    ) {}

    async getAll(page: number = 0) {
        const page_size = Number(process.env.PAGE_SIZE)
        const skip =  page * page_size
        const users = await this.userModel
            .aggregate()
            .lookup({
                from: 'posts',
                localField: 'posts',
                foreignField:'_id',
                as: 'posts'
            })
            .skip(skip)
            .limit(page_size) 
        return users
    }

    async getByID(id: string) {
        return await this.userModel.findOne({_id: id})
    }
    
    async getByUsername(username: string) {
        return await this.userModel.findOne({username: username}).exec()        
    }

    async create(user: Partial<User>){
        const find = await this.userModel.findOne({username: user.username})
        console.log(find)
        if(find) {
            throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST)
        }
        user.password = await this.encryptPassword(user)
        const createdUser = new this.userModel(user);
        const save = createdUser.save();
        if(save){
            return this.toResponseObject(createdUser)
        }
    }

    async update(user: Partial<User>, id: string) {
        let find = await this.userModel.findOne({_id: id}).exec()
        if(!find) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        user.password = await this.encryptPassword(user)
        find.password = user.password

        const update = await this.userModel.updateOne({_id: id}, find);
        if(update){
            return this.toResponseObject(find)
        }
    }

    async pushPost(idPost: string, idUser: string) {
        let find = await this.userModel.findOne({_id: idUser})
        if(!find) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        find.posts.push(idPost)
        return await find.save()
    }
    
    async removePost(idPost: string, idUser: string) {
        let find = await this.userModel.findOne({_id: idUser})
        if(!find) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND)
        }
        const index: number = find.posts.indexOf(idPost)
        if (index !== -1) {
            find.posts.splice(index, 1);
        }     
        return await find.save()
    }

    async login(user: Partial<User>){
        const { username, password } = user
        const userFind = await this.userModel.findOne({username: username})
        if( !userFind ) {
            throw new HttpException('Invalid username', HttpStatus.BAD_REQUEST)
        }
        const compare = await this.comparePassword(password, userFind)
        if(!compare) {
            throw new HttpException('Invalid password', HttpStatus.BAD_REQUEST)
        }
        return this.toResponseObject(userFind)
    }

    
    getToken(user: Partial<User>) {
        const { _id, username } = user
        return jwt.sign (
            {
                _id, username
            },
            process.env.SECRET, 
            { expiresIn: '7d'}
        )
    }

    toResponseObject(user: Partial<User>){
        return {_id: user._id, username: user.username, token: this.getToken(user)}
    }

    async encryptPassword(user: Partial<User>): Promise<string>{
        return await bcrypt.hash(user.password, 15)
    }
    
    async comparePassword(_password: string, user: Partial<User>) {
        const compare = await bcrypt.compare(_password, user.password)
        return compare 
    }


}
