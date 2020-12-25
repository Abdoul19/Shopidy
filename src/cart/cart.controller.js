import { Controller, Dependencies, Get, Post, Bind, Body, HttpStatus, Param, Request, UseGuards, HttpException } from '@nestjs/common';
import {UserService} from '../user/user.service';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
    @UseGuards(JwtAuthGuard)
    @Post('createCustomerCart')
    @Bind(Request())
    async createCustomerCart(req){
        const { user: { userPhone } } = req
        try {
            const cartId = await this.cartService.createCustomerCart(userPhone);
            return {cartId: cartId};   
        } catch (e) {
            throw new HttpException(
                { 
                  status: HttpStatus.BAD_REQUEST
                }, 
                HttpStatus.BAD_REQUEST
              )
        }
    }

    @Get('createGuestCart')
    async createGuestCart(){
        try{
            const cartId = await this.cartService.createGuestCart();
            return cartId;
        }catch(e){
            return e;
        }
        
    }

    @UseGuards(JwtAuthGuard)
    @Get('getCart/:cardId')
    @Bind(Param('cardId'))
    async getCart(cartId){
        try{
            const res = await this.cartService.getCart(cartId);
            return res;
        }catch(e){
            throw new HttpException(
                { 
                  status: HttpStatus.BAD_REQUEST
                }, 
                HttpStatus.BAD_REQUEST
              )
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('addItemToCart')
    @Bind(Request())
    async addItemToCart(req){
        const {body: {cartItem}, user: {userPhone } } = req;
        try
        {
            const res = await this.cartService.addItemToCart(cartItem, userPhone);
            return res;
        }catch(e){
            throw new HttpException(
                { 
                  status: HttpStatus.BAD_REQUEST
                }, 
                HttpStatus.BAD_REQUEST
            )
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('removeItemFromCart')
    @Bind(Body())
    async removeItemFromCart(data){
        const { cartId, itemId } = data;
        try
        {
            const res = await this.cartService.removeItemFromCart(cartId, itemId);
            return res;
        }catch(e){
            throw new HttpException(
                { 
                  status: HttpStatus.BAD_REQUEST
                }, 
                HttpStatus.BAD_REQUEST
            )
        } 
    }

    @UseGuards(JwtAuthGuard)
    @Post('updateCartItem')
    @Bind(Body())
    async updateCartItem(data){
        const { cartItem } = data;
        try
        {
            const res = await this.cartService.updateCartItem(cartItem);
            return res;
        }catch(e){
            throw new HttpException(
                { 
                  status: HttpStatus.BAD_REQUEST
                }, 
                HttpStatus.BAD_REQUEST
            )
        }
    }

    @UseGuards(JwtAuthGuard)
    @Post('getShippingMethods')
    @Bind(Request())
    async getShippingMethods(req){
        const {Body: {addressId}, user: {userPhone}} = req;
        try{
            const res = await this.cartService.getShippingMethods(userPhone, addressId);
            return res;
        }catch(e){
            throw new HttpException(
                { 
                  status: HttpStatus.BAD_REQUEST
                }, 
                HttpStatus.BAD_REQUEST
            )
        }
    }

    @Post('setShippingInformations')
    @Bind(Body())
    async setShippingInformations(data){
        const { cartId, addressInformation } = data;
        try{
            const res = await this.cartService.setShippingInformations(cartId, addressInformation);
            return res;
        }catch(e){
            return e;
        }
    }

    @Post('putOrder')
    @Bind(Body())
    async putOrder(data){
        const { cartId, method } = data;
        try{
            const res = await this.cartService.putOrder(cartId, method);
            return res;
        }catch(e){
            return e;
        }
    }

    @Get('createInvoice/:orderId')
    @Bind(Param('orderId'))
    async createInvoice(orderId){
        try{
            const res = await this.cartService.createInvoice(orderId);
            return res
        }catch(e){
            return e;
        }
    }

    @Get('getInvoice/:invoiceId')
    @Bind(Param('invoiceId'))
    async getInvoice(invoiceId){
        try{
            const res = await this.cartService.getInvoice(invoiceId);
            return res
        }catch(e){
            return e;
        }
    }

    @Post('createShipement')
    @Bind(Body())
    async createShipement(data){
        const {orderId, items, tracks} = data;
        try{
            const res = await this.cartService.createShipement(orderId, items, tracks);
            return res;
        }catch(e){
            return e;
        }
    }
}
