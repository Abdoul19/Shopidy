import { Controller, Dependencies, Get, Post, Bind, Body, Param, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { LocalAuthGuard } from '../auth/local-auth.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AuthService } from '../auth/auth.service';

@Dependencies(UserService, AuthService)
@Controller('user')
export class UserController {
    constructor(UserService, AuthService){
        this.userService = UserService;
        this.authService = AuthService;
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @Bind(Request())
    async login(req){
        return this.authService.login(req.user);
        //const {email} = data;
        // try{
        //     const res = await this.userService.searchUser(email);
        //     if(res.statusCode == 404){
        //         return res;
        //     }
        //     const user = await this.userService.getUser(res.id);
        //     return user;
        // }catch(e){
        //     return e;
        // }
    }

    @UseGuards(JwtAuthGuard)
  @Get('profile')
  @Bind(Request())
  getProfile(req) {
    return req.user;
  }

  @Post('register')
  @Bind(Body())
  async createUser(data){
    const { user } = data;
    return this.userService.createUser(user);
  }
}
