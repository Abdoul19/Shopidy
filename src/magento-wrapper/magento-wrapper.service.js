import axios from 'axios';
import { Injectable, Dependencies } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '../logger/logger.service'

import qs from 'qs';

@Dependencies(ConfigService)
@Injectable()
export class MagentoWrapperService {
    constructor(ConfigService){
        this.logger = new LoggerService('MagentoWrapperService');
        this.configService = ConfigService;
        this.MagentoClient = axios.create({
            baseURL: `${this.configService.get('magento2').url}/rest/default/V1/`,
            headers: {'Authorization': `Bearer ${this.configService.get('magento2').accessToken}`, 'Content-Type': 'application/json'},
            paramsSerializer: function (params) {
                return qs.stringify(params, {arrayFormat: 'brackets', encode: false})
            },
            // transformResponse: [function (data) {
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
        return new Promise((resolve, reject) => {
            this.MagentoClient.get(url, config).then((res) => {
                const {data} = res;
                resolve(data);
            }).catch(e => reject(e));
        });
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
    return new Promise((resolve, reject) => {
        this.MagentoClient.post(url, reqData, config).then((res) => {
            const {data} = res;
            resolve(data);
        }).catch(e => reject(e));
    });
}

    async put(url, reqData = {}, config = {}){
        return new Promise((resolve, reject) => {
            this.MagentoClient.put(url, reqData, config).then((res) => {
                const {data} = res;
                resolve(data)
            }).catch(e => {
                reject(e)
            });
        }); 
    }

    async delete(url, config = {}){
        return new Promise((resolve, reject) => {
            this.MagentoClient.delete(url, config).then((res) => {
                const {data} = res;
                resolve(data)
            }).catch(e => {
                reject(e)
            });
        }); 
    }
}
