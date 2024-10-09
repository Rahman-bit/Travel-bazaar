import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateItinerary } from './dto/itinerary.dto';
import { UpdateCreateitineraryDto } from './dto/update-createitinerary.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ItineraryService {
  
  constructor(@InjectModel('itinerary') private itineraryModel: Model<CreateItinerary>) {}

  async create(itinerary: CreateItinerary) {
    let itineraryData;
    try {
      itineraryData = new this.itineraryModel(itinerary);
      return await itineraryData.save(); 
    } catch (e) {
      throw new BadRequestException(`Invalid Data format: ${e.message}`);
    }
  }

  async findAll(): Promise<CreateItinerary[]> { // Return an array of Itinerary
    let allItineraries;
    try {
      allItineraries = await this.itineraryModel.find().exec();
      return allItineraries; // Return the found itineraries
    } catch (e) {
      throw new BadRequestException(`Could not find itineraries: ${e.message}`);
    }
  }
  

  findOne(id: number) {
    return `This action returns a #${id} createitinerary`;
  }

  update(id: number, updateCreateitineraryDto: UpdateCreateitineraryDto) {
    return `This action updates a #${id} createitinerary`;
  }

  remove(id: number) {
    return `This action removes a #${id} createitinerary`;
  }
}
