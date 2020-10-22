import { Module } from '@nestjs/common';
import { CartModule } from '../cart/cart.module';
import { StoreController } from './store.controller';

@Module({
  providers: [],
  controllers: [StoreController],
  imports: [CartModule]
})
export class StoreModule {}
