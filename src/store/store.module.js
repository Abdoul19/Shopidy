import { Module } from '@nestjs/common';
import { CartModule } from '../cart/cart.module';
import { StoreController } from './store.controller';
import { StoreService } from './store.service';

@Module({
  providers: [StoreService],
  controllers: [StoreController],
  imports: [CartModule]
})
export class StoreModule {}
