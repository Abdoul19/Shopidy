import { Injectable, Dependencies } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MagentoWrapperService } from '../magento-wrapper/magento-wrapper.service';
import { DatastoreService } from '../datastore/datastore.service'
import { recordType, recordName } from './user.recordType';

@Injectable()
@Dependencies(ConfigService, MagentoWrapperService, DatastoreService)
export class UserService {
    constructor(ConfigService, MagentoWrapperService, DatastoreService){
        this.configService = ConfigService;
        this.MagentoClient = MagentoWrapperService;
        this.datastoreService = DatastoreService;
        this.recordType = recordType;
        this.recordName = recordName;
        
        this.users = [
            {
              userId: 1,
              username: 'john',
              password: 'changeme',
            },
            {
              userId: 2,
              username: 'chris',
              password: 'secret',
            },
            {
              userId: 3,
              username: 'maria',
              password: 'guess',
            },
          ];
    }

    async findOne(username) {
        return this.users.find(user => user.username === username);
    }

    /**
     *
     *
     * @param {String} email
     * @return {Object} user
     * @memberof UserService
     */
    async searchUser(email){
        const params = {
            searchCriteria: {
                filter_groups: {
                    0: {
                        filters: {
                            0: {
                                field: 'email',
                                value: `${email}`,
                                condition_Type: 'eq'
                            }
                        }
                    }
                },
                currentPage: 1,
                pageSize: 10,
            },
        }
        try{
            const res = await this.MagentoClient.get('customers/search', {
                params: params     
            });
            const user = res.items[0];
            if(user == undefined){
                return {
                    name: 'Error',
                    statusCode: '404',
                    statuText: 'User not found'
                }
            }
            return user;
        }catch(e){
            return e;
        }
    }

    /**
     *
     *
     * @param {number} userId
     * @return {Promise<{id: number, name: string}>} user 
     * @memberof UserService
     */
    async getUser(userId){
            try{
                const res = await this.MagentoClient.get(`customers/${userId}`);
                return res;
            }catch(e){
                console.error(e);
                return e;
            }
    }

    // async createUser(user){
    //     const email = {customerEmail: user.customer.email};
    //     const emailAvail = await this.MagentoClient.post('customers/isEmailAvailable', email); 
    //     if(emailAvail) {
    //         try{
    //             const res = await this.MagentoClient.post('customers', user);
    //             return res;
    //         }catch(e){
    //             return e;
    //         } 
    //     }
    //     return 'Email unavailable';
    // }
    async createUser(user){
          const store = await this.datastoreService.createStore(this.recordType);
          return store.create(this.recordName, user);
    }

    async updateUser(user){
        try{
            const res = await this.MagentoClient.put(`customers/${user.customer.id}`, user);
            return res;
        }catch(e){
            return e;
        }
    }

    async deleteUser(userId){
        try{
            const res = await this.MagentoClient.delete(`customers/${userId}`);
            return res;
        }catch(e){
            return e;
        }
    }

    /**
     *
     *
     * @param {string} email
     * @param {string} password
     * @return {string} Token 
     * @memberof UserService
     */
    async getCustomerToken(email, password){
        try{
            const res = await this.MagentoClient.post(`integration/customer/token`, 
                {
                    username: email,
                    password: password
                },
                {
                    headers: {'Authorization': ''} 
                }
            );
            return res;
        }catch(e){
            return e;
        }
    }
}
