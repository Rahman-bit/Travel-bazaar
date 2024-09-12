import { Test, TestingModule } from '@nestjs/testing';
import { CreateNewCustomerController } from './newCustomer.controller';
import { createNewCustomerService } from './newCustomer.service';

describe('CreateleadController', () => {
  let controller: CreateNewCustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateNewCustomerController],
      providers: [createNewCustomerService],
    }).compile();

    controller = module.get<CreateNewCustomerController>(CreateNewCustomerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
