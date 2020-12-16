import { Injectable, Dependencies } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { resolveConfig } from 'prettier';

@Injectable()
@Dependencies(ConfigService)
export class SmsService {
  constructor(ConfigService){
    this.configService = ConfigService;
    
    this.smsClient = axios.create({
      baseURL: `${this.configService.get('smsApi').baseUrl}`,
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
      ).then((res) => { resolve(res.data)}).catch(e => reject(e))
    });
  }
}
