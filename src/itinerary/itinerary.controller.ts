import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItineraryService } from './itinerary.service';
import { CreateItinerary } from './dto/itinerary.dto';
import { UpdateCreateitineraryDto } from './dto/update-createitinerary.dto';

@Controller('itinerary')
export class ItineraryController {
  constructor(private readonly ItineraryService: ItineraryService) {}

  @Post()
  create(@Body() itinerary: CreateItinerary) {
    console.log("itinerary Data :", itinerary)
    return this.ItineraryService.create(itinerary);
  }

  @Get()
  async findAll() {
    const result = await this.ItineraryService.findAll();
    console.log("Result:", result);
    return result;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ItineraryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCreateitineraryDto: CreateItinerary) {
    return this.ItineraryService.update(+id, updateCreateitineraryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ItineraryService.remove(+id);
  }
}
