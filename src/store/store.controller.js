import { Controller, Dependencies, Get, Post, Body, Bind, Param } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { UserService } from '../user/user.service';

@Dependencies(CartService, UserService)
@Controller('store')
export class StoreController {
    constructor(CartService, UserService){
        this.cartService = CartService;
        this.userService = UserService;
    }


}
