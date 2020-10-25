export class UserService {
    constructor(ConfigService: any, MagentoWrapperService: any);
    configService: any;
    MagentoClient: any;
    /**
     *
     *
     * @param {String} email
     * @return {Object} user
     * @memberof UserService
     */
    searchUser(email: string): any;
    /**
     *
     *
     * @param {number} userId
     * @return {Promise<{id: number, name: string}>} user
     * @memberof UserService
     */
    getUser(userId: number): Promise<{
        id: number;
        name: string;
    }>;
    createUser(user: any): Promise<any>;
    updateUser(user: any): Promise<any>;
    deleteUser(userId: any): Promise<any>;
    /**
     *
     *
     * @param {string} email
     * @param {string} password
     * @return {string} Token
     * @memberof UserService
     */
    getCustomerToken(email: string, password: string): string;
}
