import { Injectable, Dependencies } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import qs from 'qs';
import util from 'util';

@Dependencies(ConfigService)
@Injectable()
export class MagentoWrapperService {
    constructor(ConfigService){
        this.configService = ConfigService;
        this.MagentoClient = axios.create({
            baseURL: `${this.configService.get('magento2').url}/rest/default/V1/`,
            headers: {'Authorization': `Bearer ${this.configService.get('magento2').accessToken}`, 'Content-Type': 'application/json'},
            paramsSerializer: function (params) {
                return qs.stringify(params, {arrayFormat: 'brackets', encode: false})
            },
            // transformResponse: [function (data) {
            //     //console.log(util.inspect(data));
            //     return data;
            // }],
            transformRequest: [(data, headers) => {
                // if(headers.Authorization == undefined){
                //     headers.Authorization = `Bearer ${this.configService.get('magento2').accessToken}`;
                // }
                //headers['content-type'] = 'application/json';
                return JSON.stringify(data);
            }]
        });
    }

    async get(url, config = {}){
        //console.log(util.inspect(await this.MagentoClient.get(url, params)));
        try{
            
            const res = await this.MagentoClient.get(url, config);
            console.log(res.config);
            const {data} = res;
            return data;
            
        }catch(e){
            console.error(e);
            return {
                name: 'Error',
                status: e.response.status,
                statusText: e.response.statusText
            };
        }
    }
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
async post(url, reqData = {}, config = {}){
    try{
        const res = await this.MagentoClient.post(url, reqData, config);
        const {data} = res;
        return data;
    }catch(e){
        return {
            name: 'Error',
            status: e.response.status,
            statusText: e.response.statusText
        };
    }
}

    async put(url, reqData = {}, config = {}){
        return new Promise((resolve, reject) => {
            this.MagentoClient.put(url, reqData, config).then((res) => {
                const {data} = res;
                resolve(data)
            }).catch(e => reject(e));
        }); 
    }

    async delete(url, config = {}){
        try{
            const {data} = await this.MagentoClient.delete(url, config);
            return data;
        }catch(e){
            console.error(e);
            return {
                name: 'Error',
                status: e.response.status,
                statusText: e.response.statusText
            };
        }
    }
}
