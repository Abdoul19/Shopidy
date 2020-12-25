import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { AuthModule } from '../auth/auth.module';
import {ElasticsearchModule} from '@nestjs/elasticsearch';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from '@nestjs/config';
import { UserModule } from '../user/user.module';

@Module({
    providers: [CartService],
    controllers: [CartController],
    exports: [CartService],
    imports: [
        AuthModule,
        ElasticsearchModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (ConfigService) => ({
            node: ConfigService.get('elasticsearch_node')
          }),
          inject: [ConfigService]
        }),
        UserModule
      ],
})
export class CartModule {}
