import { Module, Global } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AuthModule } from '../auth/auth.module';
import {ElasticsearchModule} from '@nestjs/elasticsearch';
import { SmsService } from '../sms/sms.service'

@Global()
@Module({
  providers: [UserService, SmsService],
  exports: [UserService],
  imports: [
    AuthModule,
    ElasticsearchModule.register({
      node: 'http://18.135.75.160:9200',
    })
  ],
  controllers: [UserController]
})
export class UserModule {}
