export class MagentoWrapperService {
    constructor(ConfigService: any);
    configService: any;
    MagentoClient: import("axios").AxiosInstance;
    get(url: any, config?: {}): Promise<any>;
    post(url: any, reqData?: {}, config?: {}): Promise<any>;
    put(url: any, reqData?: {}, config?: {}): Promise<any>;
    delete(url: any, config?: {}): Promise<any>;
}
