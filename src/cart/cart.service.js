import { Injectable, Dependencies } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MagentoWrapperService } from '../magento-wrapper/magento-wrapper.service'

/**
 * @description
 * @author Itachi
 * @date 23/10/2020
 * @type CartService
 * @export
 * @class CartService
 */
@Dependencies(MagentoWrapperService, ConfigService)
@Injectable()
export class CartService {
    /**
     * 
     * @param {Object} MagentoWrapperService 
     * @param {Object} ConfigService 
     */
    constructor(MagentoWrapperService, ConfigService){
        this.MagentoClient = MagentoWrapperService;
        this.configService = ConfigService;
    }

/**
 * @typedef { import("../types").cartItem} cartItem
 */

/**
 * @typedef { import("../types").error} error
 */

/**
 * @typedef { import("../types").cart } cart
 */

/**
 * @typedef { import("../types").address } address
 */

/**
 * @typedef { import("../types").addressInformation } addressInformation
 */

/**
 * @typedef { import("../types").shippingMethod} shippingMethod
 */

/**
 * @typedef { import("../types").paymentMethod } paymentMethod
 */

/**
 * @typedef { import("../types").totals } totals
 */

 /** 
  * @typedef {{payment_methods: paymentMethod[], totals: totals, extension_attributes?: object}} paymentMethods
  */ 

/**
 * @typedef { import("../types").invoice} invoice
 */

 /**
  * @typedef { import("../types").shippement } shippement
  */
/**
 * @description
 * @author Itachi
 * @date 23/10/2020
 * @return {Promise<string>} cartId  
 * @memberof CartService
 */
async createGuestCart(){
    try{
        /**
         * @type {string}
         */
        const cartId = await this.MagentoClient.post('guest-carts', {},
            {
                headers:{'Authorization': ''}
            }
        );
        return cartId;
    }catch(e){
        return e;
    }
}

/**
 * @description
 * @author Itachi
 * @date 23/10/2020
 * @param {number} customerId
 * @return {Promise<number>} cartId  
 * @memberof CartService
 */
async createCustomerCart(customerId){
    /**
     * @type {number}
     */
    const storeId = this.configService.get('magento2').defaultStoreId;

    try{
        const cartId = await this.MagentoClient.post('carts');
        const cartAtribution = await this.MagentoClient.put(`carts/${cartId}`, 
            {
                customerId: customerId,
                storeId: storeId
            }
        );
        return cartId;
        // {
        //     cartId: cartId,
        //     customerId: customerId,
        //     storeId: storeId,
        //     asign: cartAtribution
        // };
    }catch(e){
        return e;
    }
}

/**
 * @description
 * @author Itachi
 * @date 23/10/2020
 * @param {cartItem} cartItem
 * @param {number} cartId
 * @return {Promise<cartItem | error>} cartItem | error
 * @memberof CartService
 */
async addItemToCart(cartItem, cartId){
    try{
        /**
         * @type {cartItem}
         */
        const item = this.MagentoClient.post(`carts/${cartId}/items`, 
            {
                cartItem: cartItem
            }
        )
        return item;
    }catch(e){
        return e;
    }
}
/**
 * @description
 * @author Itachi
 * @date 23/10/2020
 * @param {cartItem} cartItem
 * @param {string} cartId
 * @return {Promise<cartItem | error>} cartItem | error
 * @memberof CartService
 */
async addItemToGuestCart(cartItem, cartId){       
    try{
        /**
         * @type cartItem
         */
        const item = this.MagentoClient.post(`guest-carts/${cartId}/items`, 
            {
                cartItem: cartItem
            },

            { headers: { Authorization: ''} }
        )
        return item;
    }catch(e){
        return e;
    }
}
/**
 * @description
 * @author Itachi
 * @date 23/10/2020
 * @param {cartItem} cartItem
 * @param {number} cartId
 * @param {number} itemId
 * @return {Promise<cartItem | error>} cartItem | error   
 * @memberof CartService
 */
async updateCartItem(cartItem, cartId, itemId){
    try
    {
        const item = await this.MagentoClient.put(`carts/${cartId}/items/${itemId}`, 
            {
                cartItem: cartItem
            }
        )
        return item;
    }catch(e){
        return e;
    }
}
/**
 * @description
 * @author Itachi
 * @date 23/10/2020
 * @param {cartItem} cartItem
 * @param {string} cartId
 * @param {number} itemId
 * @return {Promise<cartItem | error>}  cartItem | error
 * @memberof CartService
 */
async updateGuestCartItem(cartItem, cartId, itemId){
    try
    {
        const item = await this.MagentoClient.put(`guest-carts/${cartId}/items/${itemId}`, 
            {
                cartItem: cartItem
            }
        )
        return item;
    }catch(e){
        return e;
    }
}
/**
 * @description delete specified item from customer cart
 * @author Itachi
 * @date 23/10/2020
 * @param {number} cartId
 * @param {number} itemId
 * @return {Promise<Boolean>} res  
 * @memberof CartService
 */
async removeItemFromCart(cartId, itemId){
    try
    {
        const res = await this.MagentoClient.delete(`carts/${cartId}/items/${itemId}`)
        return res;
    }catch(e){
        return e;
    }
}
/**
 * @description delete specified item from guest cart 
 * @author Itachi
 * @date 23/10/2020
 * @param {string} cartId
 * @param {number} itemId
 * @return {Promise<Boolean>} res
 * @memberof CartService
 */
async removeItemFromGuestCart(cartId, itemId){
    try
    {
        const res = await this.MagentoClient.delete(`guest-carts/${cartId}/items/${itemId}`)
        return res;
    }catch(e){
        return e;
    }
}
/**
 * @description
 * @author Itachi
 * @date 23/10/2020
 * @param {number} cartId
 * @return {Promise<cart>} cart  
 * @memberof CartService
 */
async getCart(cartId){
    try{
        const cart = await this.MagentoClient.get(`carts/${cartId}`);
        return cart;
    }catch(e){
        return e;
    }
}

/**
 * @description
 * @author Itachi
 * @date 23/10/2020
 * @param {string} cartId
 * @return {Promise<cart>} cart  
 * @memberof CartService
 */
async getGuestCart(cartId){
    try{
        const cart = await this.MagentoClient.get(`guest-carts/${cartId}`);
        return cart;
    }catch(e){
        return e;
    }
}
/**
 * @description
 * @author Itachi
 * @date 23/10/2020
 * @param {number} cartId
 * @param {number} addressId
 * @return {Promise<shippingMethod>} shippingMethods  
 * @memberof CartService
 */
async getShippingMethods(cartId, addressId){
    try{
        /**
         * @type {shippingMethod}
         */
        const shippingMethods = await this.MagentoClient.post(`carts/${cartId}/estimate-shipping-methods-by-address-id`, 
            {
                addressId: addressId
            }
        )
        return shippingMethods;
    }catch(e){
        return e;
    }
}

/**
 * @description Retrive shipping methods disponible for a specified guest cart
 * @author Itachi
 * @date 23/10/2020
 * @param {string} cartId
 * @param {address} address
 * @return {Promise<shippingMethod>} shippingMethods  
 * @memberof CartService
 */
async getGuestShippingMethods(cartId, address){
    try{
        /**
         * @type {shippingMethod}
         */
        const shippingMethods = await this.MagentoClient.post(`guest-carts/${cartId}/estimate-shipping-methods`, 
            {
                address: address
            }
        )
        return shippingMethods;
    }catch(e){
        return e;
    }
}
/**
 * @description
 * @author Itachi
 * @date 24/10/2020
 * @param {number} cartId
 * @param {addressInformation} addressInformation
 * @return {Promise<paymentMethods>} paymentMethods 
 * @memberof CartService
 */
async setShippingInformations(cartId, addressInformation){
        try{
            /**
             * @type {Promise<paymentMethods>}
             */
            const paymentMethods = await this.MagentoClient.post(`carts/${cartId}/shipping-information`, 
            {
                addressInformation: addressInformation
            })
            return paymentMethods;
        }catch(e){
            return e;
        }
    }
/**
 * @description
 * @author Itachi
 * @date 25/10/2020
 * @param {string} cartId
 * @param {addressInformation} addressInformation
 * @return {Promise<paymentMethods>} paymentMethods 
 * @memberof CartService
 */
async setGuestShipingInformations(cartId, addressInformation){
    try{
        /**
         * @type Promise<paymentMethods>
         */
        const paymentMethods = await this.MagentoClient.post(`guest-carts/${cartId}/shipping-information`, 
        {
            addressInformation: addressInformation
        })
        return paymentMethods;
    }catch(e){
        return e;
    }
}
/**
 * @description
 * @author Itachi
 * @date 25/10/2020
 * @param {number} cartId
 * @param {paymentMethod} paymentMethod
 * @return {Promise<number>} orderId  
 * @memberof CartService
 */
async putOrder(cartId, paymentMethod){
    try{
        /**
         * @type Promise<number>
         */
        const orderId = await this.MagentoClient.put(`carts/${cartId}/selected-payment-method`, 
        {
            method: paymentMethod
        })
        return orderId;
    }catch(e){
        return e;
    }
}
/**
 * @description
 * @author Itachi
 * @date 25/10/2020
 * @param {string} cartId
 * @param { paymentMethods} paymentMethod
 * @return {Promise<number>} orderId  
 * @memberof CartService
 */
async putGuestOrder(cartId, paymentMethod){
    try{
        /**
         * @type Promise<number> 
         */
        const orderId = await this.MagentoClient.put(`guest-carts/${cartId}/selected-payment-method`, 
        {
            method: paymentMethod
        })
        return orderId;
    }catch(e){
        return e;
    }
}
/**
 * @description
 * @author Itachi
 * @date 25/10/2020
 * @param {number} orderId
 * @return {Promise<number>} invoiceId  
 * @memberof CartService
 */
async createInvoice(orderId){
    try{
        /**
         * @type Promise<number>
         */
        const invoiceId = await this.MagentoClient.post(`order/${orderId}/invoice`, 
            {
                capture: true,
                notify: true
            }
        )
        return invoiceId;
    }catch(e){
        return e;
    }
}
/**
 * @description
 * @author Itachi
 * @date 25/10/2020
 * @param {number} invoiceId
 * @return {Promise<invoice>} invoice  
 * @memberof CartService
 */
async getInvoice(invoiceId){
    try{
        /**
         * Promise<invoice>
         */
        const invoice = await this.MagentoClient.get(`invoices/${invoiceId}`)
        return invoice;
    }catch(e){
        return e;
    }
}

/**
 * @description
 * @author Itachi
 * @date 25/10/2020
 * @param {number} orderId
 * @param {*} items
 * @param {Promise<import('../types').track>} tracks
 * @return {Promise<shippement>} shippement 
 * @memberof CartService
 */
async createShipement(orderId, items, tracks){
        try{
            /**
             * @type Promise<shippement>
             */
            const res = await this.MagentoClient.post(`order/${orderId}/ship`, 
                {
                    items,
                    tracks
                }
            )
            return res;
        }catch(e){
            return e;
        }
    }
}
