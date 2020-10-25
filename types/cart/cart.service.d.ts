/**
 * @description
 * @author Itachi
 * @date 23/10/2020
 * @type CartService
 * @export
 * @class CartService
 */
export class CartService {
    /**
     *
     * @param {Object} MagentoWrapperService
     * @param {Object} ConfigService
     */
    constructor(MagentoWrapperService: any, ConfigService: any);
    MagentoClient: any;
    configService: any;
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
    createGuestCart(): Promise<string>;
    /**
     * @description
     * @author Itachi
     * @date 23/10/2020
     * @param {number} customerId
     * @return {Promise<number>} cartId
     * @memberof CartService
     */
    createCustomerCart(customerId: number): Promise<number>;
    /**
     * @description
     * @author Itachi
     * @date 23/10/2020
     * @param {cartItem} cartItem
     * @param {number} cartId
     * @return {Promise<cartItem | error>} cartItem | error
     * @memberof CartService
     */
    addItemToCart(cartItem: import("../types").cartItem, cartId: number): Promise<import("../types").error | import("../types").cartItem>;
    /**
     * @description
     * @author Itachi
     * @date 23/10/2020
     * @param {cartItem} cartItem
     * @param {string} cartId
     * @return {Promise<cartItem | error>} cartItem | error
     * @memberof CartService
     */
    addItemToGuestCart(cartItem: import("../types").cartItem, cartId: string): Promise<import("../types").error | import("../types").cartItem>;
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
    updateCartItem(cartItem: import("../types").cartItem, cartId: number, itemId: number): Promise<import("../types").error | import("../types").cartItem>;
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
    updateGuestCartItem(cartItem: import("../types").cartItem, cartId: string, itemId: number): Promise<import("../types").error | import("../types").cartItem>;
    /**
     * @description delete specified item from customer cart
     * @author Itachi
     * @date 23/10/2020
     * @param {number} cartId
     * @param {number} itemId
     * @return {Promise<Boolean>} res
     * @memberof CartService
     */
    removeItemFromCart(cartId: number, itemId: number): Promise<boolean>;
    /**
     * @description delete specified item from guest cart
     * @author Itachi
     * @date 23/10/2020
     * @param {string} cartId
     * @param {number} itemId
     * @return {Promise<Boolean>} res
     * @memberof CartService
     */
    removeItemFromGuestCart(cartId: string, itemId: number): Promise<boolean>;
    /**
     * @description
     * @author Itachi
     * @date 23/10/2020
     * @param {number} cartId
     * @return {Promise<cart>} cart
     * @memberof CartService
     */
    getCart(cartId: number): Promise<import("../types").cart>;
    /**
     * @description
     * @author Itachi
     * @date 23/10/2020
     * @param {string} cartId
     * @return {Promise<cart>} cart
     * @memberof CartService
     */
    getGuestCart(cartId: string): Promise<import("../types").cart>;
    /**
     * @description
     * @author Itachi
     * @date 23/10/2020
     * @param {number} cartId
     * @param {number} addressId
     * @return {Promise<shippingMethod>} shippingMethods
     * @memberof CartService
     */
    getShippingMethods(cartId: number, addressId: number): Promise<import("../types").shippingMethod>;
    /**
     * @description Retrive shipping methods disponible for a specified guest cart
     * @author Itachi
     * @date 23/10/2020
     * @param {string} cartId
     * @param {address} address
     * @return {Promise<shippingMethod>} shippingMethods
     * @memberof CartService
     */
    getGuestShippingMethods(cartId: string, address: import("../types").address): Promise<import("../types").shippingMethod>;
    /**
     * @description
     * @author Itachi
     * @date 24/10/2020
     * @param {number} cartId
     * @param {addressInformation} addressInformation
     * @return {Promise<paymentMethods>} paymentMethods
     * @memberof CartService
     */
    setShippingInformations(cartId: number, addressInformation: import("../types").addressInformation): Promise<{
        payment_methods: import("../types").paymentMethod[];
        totals: import("../types").totals;
        extension_attributes?: object;
    }>;
    /**
     * @description
     * @author Itachi
     * @date 25/10/2020
     * @param {string} cartId
     * @param {addressInformation} addressInformation
     * @return {Promise<paymentMethods>} paymentMethods
     * @memberof CartService
     */
    setGuestShipingInformations(cartId: string, addressInformation: import("../types").addressInformation): Promise<{
        payment_methods: import("../types").paymentMethod[];
        totals: import("../types").totals;
        extension_attributes?: object;
    }>;
    /**
     * @description
     * @author Itachi
     * @date 25/10/2020
     * @param {number} cartId
     * @param {paymentMethod} paymentMethod
     * @return {Promise<number>} orderId
     * @memberof CartService
     */
    putOrder(cartId: number, paymentMethod: import("../types").paymentMethod): Promise<number>;
    /**
     * @description
     * @author Itachi
     * @date 25/10/2020
     * @param {string} cartId
     * @param { paymentMethods} paymentMethod
     * @return {Promise<number>} orderId
     * @memberof CartService
     */
    putGuestOrder(cartId: string, paymentMethod: {
        payment_methods: import("../types").paymentMethod[];
        totals: import("../types").totals;
        extension_attributes?: object;
    }): Promise<number>;
    /**
     * @description
     * @author Itachi
     * @date 25/10/2020
     * @param {number} orderId
     * @return {Promise<number>} invoiceId
     * @memberof CartService
     */
    createInvoice(orderId: number): Promise<number>;
    /**
     * @description
     * @author Itachi
     * @date 25/10/2020
     * @param {number} invoiceId
     * @return {Promise<invoice>} invoice
     * @memberof CartService
     */
    getInvoice(invoiceId: number): Promise<import("../types").invoice>;
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
    createShipement(orderId: number, items: any, tracks: Promise<import('../types').track>): Promise<import("../types").shippement>;
}
