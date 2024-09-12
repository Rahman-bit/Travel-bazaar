import { Test, TestingModule } from '@nestjs/testing';
import { NewleadService } from './newlead.service';

describe('NewleadService', () => {
  let service: NewleadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NewleadService],
    }).compile();

    service = module.get<NewleadService>(NewleadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
