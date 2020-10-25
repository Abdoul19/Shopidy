export class CartController {
    constructor(CartService: any, UserService: any);
    cartService: any;
    userService: any;
    /**
     * @description
     * @author (Set the text for this tag by adding docthis.authorName to your settings file.)
     * @date 22/10/2020
     * @param {*} data
     * @return {*}
     * @memberof CartController
     */
    createCustomerCart(data: any): any;
    createGuestCart(): Promise<any>;
    getCart(cartId: any): Promise<any>;
    addItemToCart(data: any): Promise<any>;
    removeItemFromCart(data: any): Promise<any>;
    updateCartItem(data: any): Promise<any>;
    getShippingMethods(data: any): Promise<any>;
    setShippingInformations(data: any): Promise<any>;
    putOrder(data: any): Promise<any>;
    createInvoice(orderId: any): Promise<any>;
    getInvoice(invoiceId: any): Promise<any>;
    createShipement(data: any): Promise<any>;
}
