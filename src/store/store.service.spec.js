import { Test } from '@nestjs/testing';
import { StoreService } from './store.service';

describe('StoreService', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [StoreService],
    }).compile();

    service = module.get(StoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
