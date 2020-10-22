import { Module, Global } from '@nestjs/common';
import { MagentoWrapperService } from './magento-wrapper.service';

@Global()
@Module({
  providers: [MagentoWrapperService],
  exports: [MagentoWrapperService]
})
export class MagentoWrapperModule {}
