import { Test, TestingModule } from '@nestjs/testing';
import { NewleadController } from './newlead.controller';
import { NewleadService } from './newlead.service';

describe('NewleadController', () => {
  let controller: NewleadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NewleadController],
      providers: [NewleadService],
    }).compile();

    controller = module.get<NewleadController>(NewleadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
