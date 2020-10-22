import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MagentoWrapperModule } from './magento-wrapper/magento-wrapper.module';
import { StoreModule } from './store/store.module';
import { CartModule } from './cart/cart.module';
import base from './config/base';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [base],
    }),
    UserModule,
    MagentoWrapperModule,
    StoreModule,
    CartModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
