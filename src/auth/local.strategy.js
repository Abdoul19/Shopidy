
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Dependencies, HttpStatus, HttpException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoggerService } from '../logger/logger.service'

@Injectable()
@Dependencies(AuthService)
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(authService) {
    super({usernameField: "phone"});
    this.authService = authService;
    this.logger = new LoggerService('LocalStrategy', true);
  }

  async validate(phone, password) {
    return new Promise((resolve) => {
      this.authService.validateUser(phone, password).then((user) => {
        if (!user) {
          throw new UnauthorizedException();
        }
        resolve(user);
      }).catch((err) => {
        this.logger.error(err)
        resolve(null)
        
      });
    });
  }
}