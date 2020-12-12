import { Injectable, Dependencies } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Dependencies(UserService, JwtService)
@Injectable()
export class AuthService {
  constructor(UserService, JwtService){
    this.userService = UserService;
    this.jwtService = JwtService;
  }

  async validateUser(phone, pass) {
    const user = await this.userService.findOne(phone);
    const passwordCheck = await bcrypt.compare(pass, user.password);
    if (user && passwordCheck) {
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
