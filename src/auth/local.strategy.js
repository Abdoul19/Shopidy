
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Dependencies } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
@Dependencies(AuthService)
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(authService) {
    super({usernameField: "phone"});
    this.authService = authService;
  }

  async validate(phone, password) {
    const user = await this.authService.validateUser(phone, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}