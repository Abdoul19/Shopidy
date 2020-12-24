import { Injectable, Dependencies } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ElasticsearchService } from '@nestjs/elasticsearch'
import * as bcrypt from 'bcrypt';
import { MagentoWrapperService } from '../magento-wrapper/magento-wrapper.service';
import { SmsService } from '../sms/sms.service'
import { LoggerService } from '../logger/logger.service'

@Injectable()
@Dependencies(ConfigService, MagentoWrapperService, ElasticsearchService, SmsService)
export class UserService {
    constructor(ConfigService, MagentoWrapperService, ElasticsearchService, SmsService){
        this.configService = ConfigService;
        this.MagentoClient = MagentoWrapperService;
        this.elasticsearchService = ElasticsearchService;
        this.saltOrRounds = 10;
        this.smsService = SmsService;
        this.logger = new LoggerService('UserService');
    }

    async findOne(number) {
        return new Promise((resolve, reject) => {
            this.checkNumber(number).then((result) => {
                if(result){
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
                }else{
                    reject("Unrecognized Phone number")
                }
            }).catch((e) => { 
                this.logger.error(e);
                reject(e) 
            });
        });
    }

    async updateUser(user){
        return new Promise((resolve, reject) => {
            const customer = user.customer;
            
            this.checkNumber(user.phone).then((result) => {
                if(result){
                    this.MagentoClient.put(`customers/${customer.id}`, {customer}).then((data) => {
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

                    }).catch(e => {
                        this.logger.error(e);
                        reject(e)
                    });
                }else{
                    reject("Wrong phone number given");    
                }
            }).catch(e => {
                this.logger.error(e);
                reject(e)
            });
            
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
                }).catch((e) => {
                    this.logger.error(e);
                    reject(e)
                });

            }).catch(e => {
                reject(e);
            });

        });
    }

    
    async getCustomerToken(firstname, lastname, email, phone){
        return new Promise((resolve, reject) => {
            const pass = this.generatePass(firstname, lastname, phone);
            this.MagentoClient.post(`integration/customer/token`, 
                {
                    username: email,
                    password: pass
                },
                {
                    headers: {'Authorization': ''} 
                }
            ).then((data) => {
                if(data.name == 'Error'){
                    this.logger.error(data)
                    reject(data)
                }
                resolve(data);
            }).catch(e => reject(e));
            
        });
    }

    async addUser(user){
        return new Promise((resolve, reject) => {

            if(!this.checkPassword(user.password)){

                reject("Password too short");
            }
            
            else if(user.firstname.length < 2){
                reject("Firstname must be at least 2");
            }
            else if(user.lastname.length < 2){
                reject("Lastname must be at least 2")
            }

            this.checkNumber(user.phone).then((result) => {
                if(result){
                    // A resolved promise here mean that phone number is already in database, that's why we reject adding new user with the same number
                    reject("Phone number already in use")
                }else{
                
                //User not present in  database, so we create new 
                // const firstname = user.firstname;
                // First create customer object to put in magento backend
                const customerMail = user.firstname.toLowerCase() + user.phone + "@shopidy.ml";
                const pass = this.generatePass(user.firstname, user.lastname, user.phone)
                const customer = {
                    email: customerMail,
                    firstname: user.firstname,
                    lastname: user.lastname
                };
                const activation_code = this.generateActivationCode();
                const activation_code_created_at = new Date().getTime();

                // First post customer object in magento database, if this call succes then create customer object in our database
                this.MagentoClient.post('customers', {customer, password: pass}).then((data) => {

                    if(data.name !== 'Error'){

                    //User well added in magento so we hash 
                    bcrypt.hash(user.password, this.saltOrRounds).then((hash) => {
                        this.elasticsearchService.index({
                            index: "test",
                            body: {
                                customer: data,
                                password: hash,
                                phone: user.phone,
                                active: false,
                                activation_code: activation_code,
                                activation_code_created_at: activation_code_created_at
                            }
                        }).then((response) => {
                            const { body: {_id}, statusCode } = response;
                            this.smsService.sendSms(`Your Activation code is ${activation_code}`, user.phone);
                            console.log(response);
                            resolve({ id: _id });
                        }).catch(e => reject("Error on database " + e));
                    }).catch(e => {
                        this.logger.error(e);
                        reject(e)
                    });

                    }else{
                        reject(data)
                    }

                }).catch(e => {
                    this.logger.error(e);
                    reject(e)
                });
                }
                
            }).catch((e) => { this.logger.error(e); reject(e)});
                
        }); 
    }

    async readUser(id){
        return new Promise((resolve, reject) => {
            this.elasticsearchService.get({
                index: "test",
                id: id
            }).then((result) => {
                
               if(result.error){
                   reject(result.error)
               }
                
                const { body } = result;
                const user = {
                    id: body._id,
                    customer: body._source.customer,
                    phone: body._source.phone,
                };

                resolve(user);

            }).catch(e => {
                this.logger.error(e);
                reject(e)
            });
        });   
    }

    async activateUser(activation_code, phone, pass){
        return new Promise((resolve, reject) => {
            
            this.findOne(phone).then((user) => {
                const activation_code_is_valid = this.checkActivationCode(activation_code, user.activation_code_created_at);
                if(activation_code.toString().length < 4){
                    reject('Activation code must be 4 digit')
                }else if(!activation_code_is_valid){
                    reject('Activation expired')
                }else if(user.active == true){
                    reject('User already activated')
                }else{
                    bcrypt.compare(pass, user.password).then((result) => {
                        if(result){
                            if(activation_code == user.activation_code){
                                user.active = true;
                                
                                this.updateUser(user).then(() => { resolve('User Activated')}).catch(e => reject(e))
                            }else{
                                reject('Wrong activation code given');
                            }
                        }else{
                            reject('Wrong Password');    
                        }
                    }).catch((e) => {
                        this.logger.error(e); 
                        reject(e)
                    });
                }
            }).catch(e => {
                this.logger.error(e);
                reject(e)
            });
        });
    }

    async checkNumber(number){
        return new Promise((resolve, reject) => {

            if(number.toString().length != 8 ){
                reject("Phone number must be 8 digit")
            }
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
                    resolve(false);
                }
                const {phone} = result[0];
                if(phone){
                    resolve(true);
                }

                reject();
            }).catch(e => {
                // const {meta: { body: { error: { type } } } } = e;
                // if(type == 'index_not_found_exception'){
                //     resolve(false);
                // }
                reject(e)
            });
        });

    }

    async resetPassword(phone, activation_code, newPass){
        return new Promise((resolve, reject) => {

            // Case password Lost and request to reset it, Step 1
            if(!activation_code || !newPass){
                const activation_code = this.generateActivationCode();
                
                this.findOne(phone).then((user) => {

                    user.activation_code = activation_code;
                    user.activation_code_created_at = new Date().getTime();

                    this.updateUser(user).then(() => {
                        this.smsService.sendSms(`Your password reset code is ${activation_code}`, phone);
                        resolve('Password reseted');
                    }).catch(e => {
                        this.logger.error(e);
                        reject(e)
                    })
                }).catch(e => {
                    this.logger.error(e);
                    reject(e)
                });
            } 

            // Case reveived activation code and put new pass, Step 2
            else if(phone && activation_code && newPass){
                this.findOne(phone).then((user) => {
                    if(activation_code == user.activation_code){
                        const isValid = this.checkActivationCode(activation_code, user.activation_code_created_at);
                        if(isValid){
                            this.changePassword(user, newPass).then(() => { resolve('Password changed') }).catch(e => reject(e));
                        }else{
                            reject('Given credentials expired');
                        }
                    }else{ reject('Wrong activation code'); }
                }).catch(e => {
                    this.logger.error(e);
                    reject(e)
                })
            }
            
            else{
                reject('Wrong credentials given');
            }
        })
    }

    async changePassword(user, newPass){
        return new Promise((resolve, reject) => {
                if(newPass.length < 8 ){
                    reject("Password too short");
                }
                bcrypt.hash(newPass, this.saltOrRounds).then((hash) => {
                    user.password = hash;
                    this.updateUser(user).then(() => { resolve('Password updated')}).catch((e) => { reject(e) })        
                }).catch(e => {
                    this.logger.error(e);
                    reject(e)
                });
            }
        );
    }

    generateActivationCode(){
        const avtivationCodeLength = this.configService.get('user_space').activation_code_length;
        const activation_code = Math.floor((Math.random() * avtivationCodeLength) + 1000);
        return activation_code;
    }

    generatePass(firstname, lastname, phone){
        return this.reverse(firstname) + (phone+9000) + this.reverse(lastname.toUpperCase());
    }

    timeInterval( timestamp1, timestamp2){
        const interval = Math.round((timestamp2/1000/60 - timestamp1/1000/60));
        return interval;


    }

    checkActivationCode(activation_code, creation_timestamp){
        const creationInterval = this.timeInterval(creation_timestamp, new Date().getTime());
        const validityInterval = this.configService.get('user_space').activation_code_validity;

        if(isNaN(activation_code)){
            return false;
        }else if(isNaN(creation_timestamp)){
            return false;
        }else if(creationInterval > validityInterval){
            return false;
        }

        return true;
    }

    reverse(str){
        return str.split("").reverse().join("");
    }

    async resendActivationCode(phone){
        return new Promise((resolve, reject) => {
            this.findOne(phone).then((user) => {

                const isValid = this.checkActivationCode(user.activation_code, user.activation_code_created_at);
                if(user.activation_code == 0){
                    reject('No activation code requested by this user');
                }else if(isValid){
                    this.smsService.sendSms(`Your Activation code is ${user.activation_code}`, phone);
                    resolve('Code sended');
                }else{
                    const new_activation_code = this.generateActivationCode();
                    user.activation_code = new_activation_code;
                    user.activation_code_created_at = new Date().getTime();
                    this.smsService.sendSms(`Your Activation code is ${new_activation_code}`, phone);
                    this.updateUser(user).then(() => { resolve('New Code sended') }).catch(e => {
                        this.logger.error(e);
                        reject(e)
                    });
                }
            }).catch(e => {
                this.logger.error(e);
                reject(e)
            });
        });
    }

    checkPassword(password){
        if(password.toString().length < 8){
            return false;
        }
        return true;
    }
}
