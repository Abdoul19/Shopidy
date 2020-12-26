import { Injectable, Dependencies } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { LoggerService } from '../logger/logger.service';

@Injectable()
@Dependencies(ConfigService)
export class SmsService {
  constructor(ConfigService){
    this.configService = ConfigService;
    this.logger = new LoggerService('SmsService', true);
    this.smsClient = axios.create({
      baseURL: `${this.configService.get('smsApi').baseUrl}`,
      //timeout: 60000,
      headers: {'Authorization': `Bearer ${this.configService.get('smsApi').accessToken}`, 'Content-Type': 'application/json'}
    });
  }

  async sendSms(message, recipient){
    return new Promise((resolve, reject) => {
      this.smsClient.post(
        `smsmessaging/v1/outbound/tel%3A%2B${this.configService.get('smsApi').senderPhoneNumber}/requests`, 
        {
          outboundSMSMessageRequest: {
            address: `tel:+223${recipient}`,
            senderAddress: `tel:+${this.configService.get('smsApi').senderPhoneNumber}`,
            outboundSMSTextMessage: {
              message
            }
          }
        }
      ).then((res) => { resolve(res.data)}).catch(e => {
        if(e.code == 'ECONNRESET'){
          this.logger.warn(e);
          // Second attemp to send message
          this.smsClient.post(
            `smsmessaging/v1/outbound/tel%3A%2B${this.configService.get('smsApi').senderPhoneNumber}/requests`, 
            {
              outboundSMSMessageRequest: {
                address: `tel:+223${recipient}`,
                senderAddress: `tel:+${this.configService.get('smsApi').senderPhoneNumber}`,
                outboundSMSTextMessage: {
                  message
                }
              }
            }
          ).then((res) => { resolve(res.data)})
          .catch(e => {
            if(e.code == 'ECONNRESET'){
              this.logger.warn(e);
              // Third attempt to send message
              this.smsClient.post(
                `smsmessaging/v1/outbound/tel%3A%2B${this.configService.get('smsApi').senderPhoneNumber}/requests`, 
                {
                  outboundSMSMessageRequest: {
                    address: `tel:+223${recipient}`,
                    senderAddress: `tel:+${this.configService.get('smsApi').senderPhoneNumber}`,
                    outboundSMSTextMessage: {
                      message
                    }
                  }
                }
              ).then((res) => { resolve(res.data)}).catch(e => {
                this.logger.error(e);
                reject(e)
              })
            }
            this.logger.error(e);
            reject(e)
          })

        }else{
          this.logger.error(e);
          reject(e)
        }
      })
    });
  }
}
