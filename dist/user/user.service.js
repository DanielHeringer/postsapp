"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
let UserService = class UserService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    async getAll(page = 0) {
        const pageSize = Number(process.env.PAGE_SIZE);
        const skip = page * pageSize;
        const users = await this.userModel
            .aggregate()
            .lookup({
            from: 'posts',
            localField: 'posts',
            foreignField: '_id',
            as: 'posts'
        })
            .skip(skip)
            .limit(pageSize);
        return users;
    }
    async getByID(id) {
        return await this.userModel.findOne({ _id: id });
    }
    async getByUsername(username) {
        const user = await this.userModel.findOne({ username: username });
        return user;
    }
    async create(user) {
        const find = await this.userModel.findOne({ username: user.username });
        console.log(find);
        if (find) {
            throw new common_1.HttpException('Username already exists', common_1.HttpStatus.BAD_REQUEST);
        }
        user.password = await this.encryptPassword(user);
        const createdUser = new this.userModel(user);
        const save = createdUser.save();
        if (save) {
            return this.toResponseObject(createdUser);
        }
    }
    async update(user, id) {
        const find = await this.userModel.findOne({ _id: id }).exec();
        if (!find) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        user.password = await this.encryptPassword(user);
        find.password = user.password;
        const update = await this.userModel.updateOne({ _id: id }, find);
        if (update) {
            return this.toResponseObject(find);
        }
    }
    async pushPost(idPost, idUser) {
        const find = await this.userModel.findOne({ _id: idUser });
        if (!find) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        find.posts.push(idPost);
        return await find.save();
    }
    async removePost(idPost, idUser) {
        const find = await this.userModel.findOne({ _id: idUser });
        if (!find) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const index = find.posts.indexOf(idPost);
        if (index !== -1) {
            find.posts.splice(index, 1);
        }
        return await find.save();
    }
    async login(user) {
        const { username, password } = user;
        const userFind = await this.userModel.findOne({ username: username });
        if (!userFind) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const compare = await this.comparePassword(password, userFind);
        if (!compare) {
            throw new common_1.HttpException('Wrong password', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.toResponseObject(userFind);
    }
    getToken(user) {
        const { _id, username } = user;
        return jwt.sign({
            _id, username
        }, process.env.SECRET, { expiresIn: '7d' });
    }
    toResponseObject(user) {
        return { _id: user._id, username: user.username, token: this.getToken(user) };
    }
    async encryptPassword(user) {
        return await bcrypt.hash(user.password, 15);
    }
    async comparePassword(_password, user) {
        const compare = await bcrypt.compare(_password, user.password);
        return compare;
    }
};
UserService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject('USER_MODEL')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map