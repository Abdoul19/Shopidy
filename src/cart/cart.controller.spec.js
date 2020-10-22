import { Test } from '@nestjs/testing';
import { CartController } from './cart.controller';

describe('Cart Controller', () => {
  let controller;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [CartController],
    }).compile();

    controller = module.get(CartController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
