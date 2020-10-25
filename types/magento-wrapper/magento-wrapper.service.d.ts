export class MagentoWrapperService {
    constructor(ConfigService: any);
    configService: any;
    MagentoClient: import("axios").AxiosInstance;
    get(url: any, config?: {}): Promise<any>;
    /**
     * @description
     * @author Itachi
     * @date 23/10/2020
     * @param {string} url
     * @param {Object} [reqData={}]
     * @param {Object} [config={}]
     * @return {Promise<any>}
     * @memberof MagentoWrapperService
     */
    post(url: string, reqData?: any, config?: any): Promise<any>;
    put(url: any, reqData?: {}, config?: {}): Promise<any>;
    delete(url: any, config?: {}): Promise<any>;
}
