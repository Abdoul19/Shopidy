export class CartService {
    constructor(MagentoWrapperService: any, ConfigService: any);
    MagentoClient: any;
    configService: any;
    createGuestCart(): Promise<any>;
    createCustomerCart(customerId: any, storeId?: any): Promise<any>;
    addItemToCart(cartItem: any, cartId: any): Promise<any>;
    updateCartItem(cartItem: any, cartId: any, itemId: any): Promise<any>;
    removeItemFromCart(cartId: any, itemId: any): Promise<any>;
    getCart(cartId: any): Promise<any>;
}
