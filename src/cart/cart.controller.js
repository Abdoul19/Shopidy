import { Controller, Dependencies, Get, Post, Body, Bind, Param } from '@nestjs/common';
import {UserService} from '../user/user.service';
import { CartService } from './cart.service';

@Dependencies(CartService, UserService)
@Controller('cart')
export class CartController {

    constructor(CartService, UserService){
        this.cartService = CartService;
        this.userService = UserService;
    }

    /**
     * @description
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @date 22/10/2020
     * @param {*} data
     * @return {*} 
     * @memberof CartController
     */
    @Post('createCustomerCart')
    @Bind(Body())
    async createCustomerCart(data){
        const { customerId } = data;
        const quote = await this.cartService.createCustomerCart(customerId);
        return quote;
    }

    @Get('createGuestCart')
    async createGuestCart(){
        const quote = await this.cartService.createGuestCart();
        return quote;
    }

    @Get('getCart/:cardId')
    @Bind(Param('cardId'))
    async getCart(cartId){
        try{
            const res = await this.cartService.getCart(cartId);
            return res;
        }catch(e){
            return e;
        }
    }

    @Post('addItemToCart')
    @Bind(Body())
    async addItemToCart(data){
        const {cartItem, cartId} = data;
        try{
            const res = await this.cartService.addItemToCart(cartItem, cartId);
            return res;
        }catch(e){
            return e;
        }
    }

    @Post('removeItemFromCart')
    @Bind(Body())
    async removeItemFromCart(data){
        const { cartId, itemId } = data;
        try
        {
            const res = await this.cartService.removeItemFromCart(cartId, itemId);
            return res;
        }catch(e){
            return e;
        } 
    }

    @Post('updateCartItem')
    @Bind(Body())
    async updateCartItem(data){
        const { cartItem, cartId, itemId } = data;
        try
        {
            const res = await this.cartService.updateCartItem(cartItem, cartId, itemId);
            return res;
        }catch(e){
            return e;
        }
    }

    // @Get('deleteCart/:cartId')
    // @Bind(Param())
    // async deleteCart(cardId){}
}
