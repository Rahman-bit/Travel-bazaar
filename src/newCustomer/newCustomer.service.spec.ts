import { Test, TestingModule } from '@nestjs/testing';
import { createNewCustomerService } from './newCustomer.service';

describe('createNewCustomerService', () => {
  let service: createNewCustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [createNewCustomerService],
    }).compile();

    service = module.get<createNewCustomerService>(createNewCustomerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
