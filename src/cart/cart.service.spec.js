import { Test } from '@nestjs/testing';
import { CartService } from './cart.service';

describe('CartService', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [CartService],
    }).compile();

    service = module.get(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
