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
      const timeInterval = this.userService.timeInterval(user.customer_token_created_at, new Date().getTime() )
      // if user is authenticated, we generate magento token for request
      // And then atach this token to user object
      if(!user.customer_token){
        
        const customer_token = await this.userService.getCustomerToken(user.customer.firstname, user.customer.lastname, user.customer.email, user.phone);
        user.customer_token = customer_token;
        user.customer_token_created_at = new Date().getTime();
        await this.userService.updateUser(user);

      }else if( timeInterval > 60 ){
        
        const customer_token = await this.userService.getCustomerToken(user.customer.firstname, user.customer.lastname, user.customer.email, user.phone);
        user.customer_token = customer_token;
        user.customer_token_created_at = new Date().getTime();
        await this.userService.updateUser(user);
      
      }

      

      // Remove password from user object
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user) {
    const payload = {userId: user.id, userPhone: user.phone};
    return {
      access_token: this.jwtService.sign(payload), // Token used by user for request to nest backend
      customer_token: user.customer_token // Token used by user for direct request to magento
    };
  }

  async timeInterval( timestamp1, timestamp2){
    const hourInterval = Math.round(timestamp2/60) - Math.round(timestamp1/60/60);
    return hourInterval;
  }

}
