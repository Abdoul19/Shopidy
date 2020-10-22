import { Injectable, Dependencies } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MagentoWrapperService } from '../magento-wrapper/magento-wrapper.service'

@Dependencies(MagentoWrapperService, ConfigService)
@Injectable()
export class CartService {
    constructor(MagentoWrapperService, ConfigService){
        this.MagentoClient = MagentoWrapperService;
        this.configService = ConfigService;
    }

    async createGuestCart(){
        try{
            const res = await this.MagentoClient.post('guest-carts', {},
                {
                    headers:{'Authorization': ''}
                }
            );
            return res;
        }catch(e){
            return e;
        }
    }

    async createCustomerCart(customerId, storeId = this.configService.get('magento2').defaultStoreId){
        try{
            const quote = await this.MagentoClient.post('carts');
            const cartAtribution = await this.MagentoClient.put(`carts/${quote}`, 
                {
                    customerId: customerId,
                    storeId: storeId
                }
            );
            return {
                cartId: quote,
                customerId: customerId,
                storeId: storeId,
                asign: cartAtribution
            };
        }catch(e){
            return e;
        }
    }

    async addItemToCart(cartItem, cartId){
        
        try{
            const res = this.MagentoClient.post(`carts/${cartId}/items`, 
                {
                    cartItem: cartItem
                }
            )
            return res;
        }catch(e){
            return e;
        }
    }

    async updateCartItem(cartItem, cartId, itemId){
        try
        {
            const res = await this.MagentoClient.put(`carts/${cartId}/items/${itemId}`, 
                {
                    cartItem: cartItem
                }
            )
            return res;
        }catch(e){
            return e;
        }
    }

    async removeItemFromCart(cartId, itemId){
        try
        {
            const res = await this.MagentoClient.delete(`carts/${cartId}/items/${itemId}`)
            return res;
        }catch(e){
            return e;
        }
    }

    async getCart(cartId){
        try{
            const res = await this.MagentoClient.get(`carts/${cartId}`);
            return res;
        }catch(e){
            return e;
        }
    }
}
