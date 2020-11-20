import { Controller, Dependencies, Get, Post, Body, Bind } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user/user.service';

@Controller()
@Dependencies(AppService, UserService)
export class AppController {
  constructor(appService, userService, DatastoreService) {
    this.appService = appService;
    this.userService = userService;
  }

  @Get()
  getHello() {
    return this.userService.getUsersList();
  }

  @Get('get-user')
  async getUser() {
    try{
      const res = await this.userService.getUser(10);
      return res;
    }catch(e){
      console.error(e);
      return e;
    }
  }

  @Get('add-user')
  async addUser(){
    const User = {
      customer: {
        email: "test1111@test.ml",
        firstname: "Jane",
        lastname: "Doe",
        addresses: [
          {
            defaultShipping: true,
            defaultBilling: true,
            firstname: "Jane",
            lastname: "Doe",
            region: {
              regionCode: "NY",
              region: "New York",
              regionId: 43
            },
            postcode: "10755",
            street: [
              "123 Oak Ave"
            ],
            city: "Purchase",
            telephone: "512-555-1111",
            countryId: "US"
          }
        ]
      },
      password: "Password1"
    }
    try{
      const res = await this.userService.createUser(User);
      return res
    }catch(e){
      return e;
    }
  }

  @Get('update-user')
  async updateUser(User){
    try{
      const res = await this.userService.updateUser({customer: User});
      return res
    }catch(e){
      return e;
    }
  }

  @Get('delete-user')
  async updateUser(){
    try{
      const res = await this.userService.deleteUser(9);
      return res
    }catch(e){
      return e;
    }
  }

  @Get('user-token')
  async getUserToken(){
    try{
      const res = await this.userService.getCustomerToken("test1111@test.ml", "Password1");
      return res
    }catch(e){
      return e;
    }
  }

  @Get('create-customer-cart')
  async createCart()
  {
    const token = '1zlbwb44etvj9l3s6pisjbtemx10t3az';
    try{
      const res = await this.userService.createCart();
      return res;
    }catch(e){
      return e;
    }
  }

  @Post('createCartItem')
  @Bind(Body())
  async createCartItem(body)
  {
    console.log(body);
    return true;
    // const cartItem = {
    //   quote_id: '',
    //   sku: '',
    //   qty: 0,
    //   price: 0,
    // }
    // try{
    //   if(customerToken != '')
    //   {
    //     const res = await this.userService.addItemToCart(cartItem, '', customerToken);
    //     return res;
    //   }
    //   const res = await this.userService.addItemToCart(cartItem, cartId, guestToken);
    //   return res;
    // }catch(e){
    //   return e;
    // }
  }
}
