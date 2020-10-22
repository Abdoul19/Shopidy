export class CartController {
    constructor(CartService: any, UserService: any);
    cartService: any;
    userService: any;
    createCustomerCart(data: any): Promise<any>;
    createGuestCart(): Promise<any>;
    getCart(cartId: any): Promise<any>;
    addItemToCart(data: any): Promise<any>;
    removeItemFromCart(data: any): Promise<any>;
    updateCartItem(data: any): Promise<any>;
}
