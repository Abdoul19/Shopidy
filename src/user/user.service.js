import { Injectable, Dependencies } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch'
import * as bcrypt from 'bcrypt';
import { MagentoWrapperService } from '../magento-wrapper/magento-wrapper.service';
import { DatastoreService } from '../datastore/datastore.service'
import { recordType, recordName } from './user.recordType';

@Injectable()
@Dependencies(ConfigService, MagentoWrapperService, DatastoreService, ElasticsearchService)
export class UserService {
    constructor(ConfigService, MagentoWrapperService, DatastoreService, ElasticsearchService){
        this.configService = ConfigService;
        this.MagentoClient = MagentoWrapperService;
        this.datastoreService = DatastoreService;
        this.recordType = recordType;
        this.recordName = recordName;
        this.elasticsearchService = ElasticsearchService;
        this.saltOrRounds = 10;

        
    }

    async findOne(number) {
        return new Promise((resolve, reject) => {
            this.checkNumber(number).then(() => {
                this.elasticsearchService.search({
                    index: "test",
                    body: {
                        query:{
                            match:{
                                phone: number
                            }
                        }
                    }
                }).then((result) => {
                    const {body: { hits: { hits } } } = result;
                    const user = hits[0]._source;
                    user.id = hits[0]._id;
                    
                    resolve(user);
                }).catch(e => { reject(e) });
            }).catch(() => { reject("Unrecognized Phone number") });
        });
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
        return new Promise((resolve, reject) => {
            const customer = user.customer;
            
            this.checkNumber(user.phone).then(() => {
                this.MagentoClient.put(`customers/${customer.id}`, {customer}).then((data) => {
                    // console.log(data);
                    // resolve(data);
                    const {id, ...body} = user;
                    body.customer = data;
                    this.elasticsearchService.index({
                        index: "test",
                        id,
                        body
                    }).then((response) => {
                        const { body: {_id}, statusCode } = response;
                        resolve(
                            {
                                id: _id
                            }
                        );
                    }).catch(e => reject("Error on database " + e));

                }).catch(e => reject(e));
            }).catch(e => reject(e));
            
        });
    }

    async deleteUser(user){
        return new Promise((resolve, reject) => {

            this.MagentoClient.delete(`customers/${user.customer.id}`).then((res) => {
                this.elasticsearchService.helpers.bulk({
                    datasource: [user],
                    onDocument (user) {
                        return {
                        delete: { _index: 'test', _id: user.id }
                        }
                    }
                }).then(() => {
                    resolve("User deleted");
                }).catch((e) => {reject(e)});

            }).catch(e => {
                reject(e);
            });

        });
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
        return new Promise((resolve, reject) => {
            this.MagentoClient.post(`integration/customer/token`, 
                {
                    username: email,
                    password: password
                },
                {
                    headers: {'Authorization': ''} 
                }
            ).then((res) => {
                resolve(res);
            }).catch(e => reject(e));
            
        });
    }

    async addUser(user){
        return new Promise((resolve, reject) => {

            if(user.password.length < 8){
                reject("Password too short");
            }
            // else if(isNaN(user.phone)){
            //     reject("Given Phone number is not valid");
            // }
            else if(user.phone.toString().length < 8){
                reject("Phone number must be at least 8")
            }
            else if(user.firstname.length < 2){
                reject("Firstname must be at least 2");
            }
            else if(user.lastname.length < 2){
                reject("Lastname must be at least 2")
            }

            this.checkNumber(user.phone).then(() => {
                // A resolved promise here mean that phone number is already in database, that's why we reject adding new user with the same number
                reject("Phone number already in use")
            }).catch(() => {
                //User not present in  database, so we create new 
                // const firstname = user.firstname;
                // First create customer object to put in magento backend
                const customerMail = user.firstname.toLowerCase() + user.phone + "@shopidy.ml"
                const customer = {
                    email: customerMail,
                    firstname: user.firstname,
                    lastname: user.lastname
                };

                // First post customer object in magento database, if this call succes then create customer object in our database
                this.MagentoClient.post('customers', {customer, password: user.password}).then((data) => {

                    //User well added in magento so we hash 
                    bcrypt.hash(user.password, this.saltOrRounds).then((hash) => {
                        this.elasticsearchService.index({
                            index: "test",
                            body: {
                                customer: data,
                                password: hash,
                                phone: user.phone
                            }
                        }).then((response) => {
                            const { body: {_id}, statusCode } = response;
                            resolve(
                                {
                                    id: _id
                                }
                            );
                        }).catch(e => reject("Error on database " + e));
                    }).catch(e => reject("Error on hashing password" + e));

                }).catch(e => reject(e));
                 

            });
                
        }); 
    }

    async readUser(number){
        return new Promise((resolve, reject) => {
            this.checkNumber(number).then(() => {
                this.elasticsearchService.search({
                    index: "test",
                    body: {
                        query:{
                            match:{
                                phone: number
                            }
                        }
                    }
                }).then((result) => {
                    //const { password, ...rest } = result[0];
                    const {body: { hits: { hits } } } = result;
                    const user = {
                        id: hits[0]._id,
                        customer: hits[0]._source.customer,
                        phone: hits[0]._source.phone,
                    };
                    resolve(user);
                }).catch(e => { console.error(e);reject(e) });
            }).catch((e) => { console.error(e); reject(e) });
        });   
    }

    async checkNumber(number){
        return new Promise((resolve, reject) => {
            this.elasticsearchService.helpers.search({
                index: "test",
                body: {
                    query:{
                        match:{
                            phone: number
                        }
                    }
                }
            }).then((result) => {
                if(!result[0]){
                    reject(false);
                }
                const {phone} = result[0];
                if(phone){
                    resolve();
                }

                reject();
            }).catch(e => { reject(e) });
        });
    }
}
