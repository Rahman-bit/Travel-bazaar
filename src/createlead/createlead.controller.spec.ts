import { Test, TestingModule } from '@nestjs/testing';
import { CreateleadController } from './createlead.controller';
import { CreateleadService } from './createlead.service';

describe('CreateleadController', () => {
  let controller: CreateleadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateleadController],
      providers: [CreateleadService],
    }).compile();

    controller = module.get<CreateleadController>(CreateleadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
