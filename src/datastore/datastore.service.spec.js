import { Test } from '@nestjs/testing';
import { DatastoreService } from './datastore.service';

describe('DatastoreService', () => {
  let service;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DatastoreService],
    }).compile();

    service = module.get(DatastoreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
