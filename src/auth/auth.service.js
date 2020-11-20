import { Injectable, Dependencies } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Dependencies(UserService, JwtService)
@Injectable()
export class AuthService {
  constructor(UserService, JwtService){
    this.userService = UserService;
    this.jwtService = JwtService;
  }

  async validateUser(username, pass) {
    const user = await this.userService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
