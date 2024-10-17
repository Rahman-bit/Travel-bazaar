import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { Itinerary } from './dto/itinerary.dto';
import { UpdateCreateitineraryDto } from './dto/createitinerary.dto';

@Controller('itinerary')
export class ItineraryController {
  constructor(private readonly ItineraryService: ItineraryService) {}
  // http://localhost:3500/itinerary
  @Post()
  async create(@Body() itinerary: Itinerary): Promise<Itinerary> {
    // console.log("itinerary Data :", itinerary)
    return this.ItineraryService.createItinerary(itinerary);
  }
  // http://localhost:3500/itinerary
  @Get()
  async findAllLeads(): Promise<Itinerary[]> {
    const result = await this.ItineraryService.findAllItinerary();
    return result;
  }
  // http://localhost:3500/itinerary/67096ea8bb8a2cc8bb5bb6f0
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Itinerary> {
    return this.ItineraryService.getItineraryById(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() itineraryDto: Itinerary) {
    return this.ItineraryService.updateById(id, itineraryDto);
  }

   // Update nested object by ID
  @Put(':itineraryId/:nestedObjectId')
  async updateNestedObject(
    @Param('itineraryId') itineraryId: string,
    @Param('nestedObjectId') nestedObjectId: string,
    @Body() updateData: any,
  ) { 
    console.log(`PUT request to update nested object with ID: ${nestedObjectId} in itinerary: ${itineraryId}`); // Debug log
    return this.ItineraryService.updateNestedObject(itineraryId, nestedObjectId, updateData);
  }

  @Delete(':itineraryId')
  async delete(@Param('itineraryId') itineraryId: string){
    return this.ItineraryService.deleteLead(itineraryId)
  }

  @Delete(':itineraryId/:nestedObjectId')
  async remove(
      @Param('itineraryId') itineraryId: string,
      @Param('nestedObjectId') nestedObjectId: string,
    ) {
      return this.ItineraryService.deleteNestedObject(itineraryId, nestedObjectId);
    }
}
