import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import {ElasticsearchModule} from '@nestjs/elasticsearch';
import { SmsService } from '../sms/sms.service'
import { config } from 'rxjs';

@Global()
@Module({
  providers: [UserService, SmsService],
  exports: [UserService],
  imports: [
    AuthModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (ConfigService) => ({
        node: ConfigService.get('elasticsearch_node')
      }),
      inject: [ConfigService]
    })
  ],
  controllers: [UserController]
})
export class UserModule {}
