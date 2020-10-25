export class UserController {
    constructor(UserService: any);
    userService: any;
    login(email: any): Promise<any>;
    getUser(userId: any): Promise<any>;
}
