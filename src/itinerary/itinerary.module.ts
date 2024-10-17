import { Module } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { ItineraryController } from './itinerary.controller';
import { ItinerarySchema } from './entities/itinerary.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports : [ MongooseModule.forFeature([{ name: 'itinerary', schema: ItinerarySchema }])],
  controllers: [ItineraryController],
  providers: [ItineraryService],
})
export class ItineraryModule {}
