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
    return new Promise((resolve, reject) => {
      this.userService.findOne(phone).then((user) => {
        bcrypt.compare(pass, user.password).then((passwordCheck) => {
          if (user && passwordCheck) {
            const timeInterval = this.userService.timeInterval(user.customer_token_created_at, new Date().getTime() )
            // if user is authenticated, we generate magento token for request
            // And then atach this token to user object
            if(!user.customer_token){
              
              this.userService.getCustomerToken(user.customer.firstname, user.customer.lastname, user.customer.email, user.phone).then((customer_token) => {
                user.customer_token = customer_token;
                user.customer_token_created_at = new Date().getTime();
                this.userService.updateUser(user).then(() => {
                  resolve(user)
                }).catch((err) => {
                  reject(err);
                });
              }).catch((err) => {
                reject(err);
              });
              
  
            }else if( timeInterval > 60 ){
              
              this.userService.getCustomerToken(user.customer.firstname, user.customer.lastname, user.customer.email, user.phone).then((customer_token) => {
                user.customer_token = customer_token;
                user.customer_token_created_at = new Date().getTime();
                this.userService.updateUser(user).then(() => {
                  resolve(user)
                }).catch((err) => {
                  reject(err)
                });
              }).catch((err) => {
                reject(err)
              });            
            }
  
            
  
            // Remove password from user object
            const { password, ...result} = user;
            resolve(result);
          }
          resolve(null);
        }).catch((err) => {
          reject(err)
        });
      }).catch((err) => {
        reject(err)
      });
    });
  }

  async login(user) {
    const payload = {userId: user.id, userPhone: user.phone};
    return {
      access_token: this.jwtService.sign(payload), // Token used by user for request to nest backend
      customer_token: user.customer_token // Token used by user for direct request to magento
    };
  }

  async timeInterval( timestamp1, timestamp2){
    const hourInterval = Math.round(timestamp2/60/60) - Math.round(timestamp1/60/60);
    return hourInterval;
  }

}
