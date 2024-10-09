import { Test, TestingModule } from '@nestjs/testing';
import { CreateitineraryController } from './itinerary.controller';
import { ItineraryService } from './itinerary.service';

describe('CreateitineraryController', () => {
  let controller: CreateitineraryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateitineraryController],
      providers: [ItineraryService],
    }).compile();

    controller = module.get<CreateitineraryController>(CreateitineraryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
