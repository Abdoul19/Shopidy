export class AppController {
    constructor(appService: any, userService: any);
    appService: any;
    userService: any;
    getHello(): any;
    getUser(): Promise<any>;
    addUser(): Promise<any>;
    updateUser(User: any): Promise<any>;
    getUserToken(): Promise<any>;
    createCart(): Promise<any>;
    createCartItem(body: any): Promise<boolean>;
}
