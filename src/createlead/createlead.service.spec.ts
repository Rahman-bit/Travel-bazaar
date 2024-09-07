import { Test, TestingModule } from '@nestjs/testing';
import { CreateleadService } from './createlead.service';

describe('CreateleadService', () => {
  let service: CreateleadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CreateleadService],
    }).compile();

    service = module.get<CreateleadService>(CreateleadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
