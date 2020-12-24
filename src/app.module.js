import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MagentoWrapperModule } from './magento-wrapper/magento-wrapper.module';
import { AuthModule } from './auth/auth.module';
import { SmsService } from './sms/sms.service';
import base from './config/base';
import smsApi from './config/smsApi';
import databaseConfig from './config/databaseConfig';
// import { DatastoreModule } from './datastore/datastore.module';
 import { StoreModule } from './store/store.module';
// import { CartModule } from './cart/cart.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [base, databaseConfig, smsApi],
    }),
    UserModule,
    StoreModule,
    MagentoWrapperModule,
    AuthModule,
    LoggerModule,
  ],
  controllers: [AppController],
  providers: [AppService, SmsService],
})
export class AppModule {}
