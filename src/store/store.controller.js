import { Controller, Dependencies, Get, Post, Body, Bind, Param, HttpStatus, HttpException } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { UserService } from '../user/user.service';
import { StoreService} from './store.service';

@Dependencies(CartService, UserService, StoreService)
@Controller('store')
export class StoreController {
    constructor(CartService, UserService, StoreService){
        this.cartService = CartService;
        this.userService = UserService;
        this.storeService = StoreService;
    }

    @Get('categories')
    async getCategories()
    {
        try{
            return await this.storeService.getCategories();
        }catch(e){
            throw new HttpException(
                { 
                  status: HttpStatus.BAD_REQUEST,
                  error: e
                }, 
                HttpStatus.BAD_REQUEST
              )
        }
    }

    @Post('categories/products')
    @Bind(Body())
    async getCategoriesProducts(data)
    {
        const { categorieId, request } = data;
        try{
            
            return await this.storeService.getCategoriesProducts(categorieId, request);
        }catch(e){
            throw new HttpException(
                { 
                  status: HttpStatus.BAD_REQUEST,
                  error: e
                }, 
                HttpStatus.BAD_REQUEST
              )
        }
    }

    @Get('products/:sku')
    @Bind(Param('sku'))
    async getProduct(sku)
    {
        try{
            return await this.storeService.getProducts(sku);
        }catch(e){
            throw new HttpException(
                { 
                  status: HttpStatus.BAD_REQUEST,
                  error: e
                }, 
                HttpStatus.BAD_REQUEST
              )
        }
    }

    @Post('products/search')
    @Bind(Body())
    async productsSearch(data)
    {
        const { request } = data
        try{
            return await this.storeService.productsSearch(request);
        }catch(e){
            throw new HttpException(
                { 
                  status: HttpStatus.BAD_REQUEST,
                  error: e
                }, 
                HttpStatus.BAD_REQUEST
              )
        }
    }

}
