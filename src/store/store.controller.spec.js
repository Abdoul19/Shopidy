import { Test } from '@nestjs/testing';
import { StoreController } from './store.controller';

describe('Store Controller', () => {
  let controller;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [StoreController],
    }).compile();

    controller = module.get(StoreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
