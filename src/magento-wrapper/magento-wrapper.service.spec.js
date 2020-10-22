import { Test } from '@nestjs/testing';
import { MagentoWrapperService } from './magento-wrapper.service';

describe('MagentoWrapperService', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [MagentoWrapperService],
    }).compile();

    service = module.get(MagentoWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
