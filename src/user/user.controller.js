import { Controller, Dependencies, Get, Post, Bind, Body, HttpStatus, Param, Request, UseGuards, HttpException } from '@nestjs/common';
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

  @Post('addUser')
  @Bind(Body())
  async addUser(data){
    const { user } = data;
    try{
      return await this.userService.addUser(user);
    }catch(e){
      throw new HttpException(
        { 
          status: HttpStatus.BAD_REQUEST,
          error: e
        }, 
        HttpStatus.BAD_REQUEST
      )
    }
  }

  @Post('readUser')
  @Bind(Body())
  async readeUser(data){
    const { phone } = data;
    try{
      return await this.userService.readUser(phone);
    }catch(e){ 
      throw new HttpException(
        { 
          status: HttpStatus.NOT_FOUND,
          error: e
        }, 
        HttpStatus.NOT_FOUND
      )
    }
  }
}
