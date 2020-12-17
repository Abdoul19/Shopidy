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
      if(!req.user.active){
        throw new HttpException(
          { 
            status: HttpStatus.NOT_FOUND,
            error: 'User not active'
          }, 
          HttpStatus.NOT_FOUND
        ) 
      }
      return this.authService.login(req.user);
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

  @UseGuards(JwtAuthGuard)
  @Post('readUser')
  @Bind(Request())
  async readeUser(req){
    const id = req.user.userId;
    
    try{
      return await this.userService.readUser(id);
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

  @UseGuards(JwtAuthGuard)
  @Post('updateUser')
  @Bind(Body())
  async updateUser(data){
    const { user } = data;
    try{
      return await this.userService.updateUser(user);
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

  @UseGuards(JwtAuthGuard)
  @Post('deleteUser')
  @Bind(Body())
  async deleteUser(data){
    const { user } = data;
    try{
      return await this.userService.deleteUser(user);
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

  @Post('activateUser')
  @Bind(Body())
  async activateUser(data){
    const { activation_code, phone, password } = data;
    try{
      return await this.userService.activateUser(activation_code, phone, password);
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

  @UseGuards(JwtAuthGuard)
  @Post('changePassword')
  @Bind(Request())
  async changePassword(req){
    const phone = req.body.phone
    const newPass = req.body.password
    try{
      const user = await this.userService.findOne(phone);
      return await this.userService.changePassword(user, newPass);
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

  @Post('resetPassword')
  @Bind(Body())
  async resetPassword(data){
    const { phone, activation_code, newPass } = data;
    try{
      return await this.userService.resetPassword(phone, activation_code, newPass);
    }catch(e) {
      throw new HttpException(
        { 
          status: HttpStatus.NOT_FOUND,
          error: e
        }, 
        HttpStatus.NOT_FOUND
      )
    }
  }
  
  @Post('resendActivationCode')
  @Bind(Body())
  async resendPassword(data){
    const { phone} = data;
    try{
      return await this.userService.resendActivationCode(phone);
    }catch(e) {
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
