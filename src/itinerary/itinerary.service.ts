import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Itinerary } from './dto/itinerary.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, MongooseError, Types } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class ItineraryService {
  
  constructor(@InjectModel('itinerary') private itineraryModel: Model<Itinerary>) {}

  async validateLeadIdAndFind(leadId: string): Promise<Itinerary> {

      if (!mongoose.Types.ObjectId.isValid(leadId)) {
        throw new BadRequestException('Invalid Lead ID format Sayyed');
      }

      const existingLead = await this.itineraryModel.findById(leadId).exec();

      if (!existingLead) {
        throw new NotFoundException(`Lead with id ${leadId} not found`);
      }

      return existingLead;
  }

  // The replaceId method can be declared inside the class like this:
  private replaceId(obj: any): any {
      if (Array.isArray(obj)) {
        return obj.map(item => this.replaceId(item)); 
      } else if (typeof obj === 'object' && obj !== null) {
        const newObj: any = {};
        for (const key in obj) {
          if (key === '_id') {
            newObj['id'] = obj[key]; 
          } else if (typeof obj[key] === 'object') {
            newObj[key] = this.replaceId(obj[key]); 
          } else {
            newObj[key] = obj[key]; 
          }
        }
        return newObj;
      }
      return obj;
  }

 // Find invoice by id
 async findOne(id: string): Promise<Itinerary> {

  const itinerary = await this.itineraryModel.findById(id).exec();

  if (!itinerary) {
    throw new NotFoundException(`itinerary with ID ${id} not found`);
  }

  return itinerary;
}
  // Recursive function to update a nested object
private recursiveUpdate(
    obj: any,
    nestedObjectId: string | ObjectId,
    updateData: any,
    visited = new Set<any>()
  ): any {
    // Prevent circular references
    if (visited.has(obj)) {
      
      return null;
    }
    visited.add(obj);
  
    if (!obj || typeof obj !== 'object') {
      return null; 
    }
  
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        // Traverse arrays
        for (let i = 0; i < obj[key].length; i++) {
          const item = obj[key][i];
  
          // Ensure item._id and nestedObjectId are valid ObjectId strings
          if (item && item._id && ObjectId.isValid(item._id) && ObjectId.isValid(nestedObjectId)) {
            // Convert item._id and nestedObjectId to ObjectId before comparison
            if (new ObjectId(item._id).equals(new ObjectId(nestedObjectId))) {
              console.log(`Found Itinerary nested object with ID: ${nestedObjectId} at array index: ${i}, key: ${key}`);
  
              // Update only the properties in updateData without removing other properties
              Object.assign(item, updateData);
  
              return item;  
            }
          }
          const updatedNestedItem = this.recursiveUpdate(item, nestedObjectId, updateData, visited);
          if (updatedNestedItem) return updatedNestedItem; // If found, return it
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Ensure obj[key]._id and nestedObjectId are valid ObjectId strings
        if (obj[key]._id && ObjectId.isValid(obj[key]._id) && ObjectId.isValid(nestedObjectId)) {
          // Convert obj[key]._id and nestedObjectId to ObjectId before comparison
          if (new ObjectId(obj[key]._id).equals(new ObjectId(nestedObjectId))) {
            console.log(`Found Itinerary nested object with ID: ${nestedObjectId} at key: ${key}`);
  
            // Update only the properties in updateData without removing other properties
            Object.assign(obj[key], updateData);
  
            return obj[key];  // Return the updated object
          }
        }
        // Recur into nested objects
        const updatedNestedItem = this.recursiveUpdate(obj[key], nestedObjectId, updateData, visited);
        if (updatedNestedItem) return updatedNestedItem; // If found, return it
      }
    }
    // Log if nothing was found
    // console.log(`Itinerary Nested object with ID: ${nestedObjectId} not found`);
    return null;  // Return null if no match is found
  }

  private async recursiveDelete(obj: any, nestedObjectId: string, visited = new Set()): Promise<boolean> {
    // Prevent circular references
    if (visited.has(obj)) {
      return false;
    }
    // Add the current object to the visited set
    visited.add(obj);
  
    for (const key in obj) {
      if (Array.isArray(obj[key])) {
        // Traverse arrays
        for (let i = 0; i < obj[key].length; i++) {
          const item = obj[key][i];
  
          // Check if the current array item has the matching id
          if (item._id && item._id.toString() === nestedObjectId) {
            console.log(`Deleting Itinerary nested object with ID: ${nestedObjectId} at array index: ${i}`);
            obj[key].splice(i, 1); // Delete the found item
            return true; // Deletion successful
          }
  
          // Recur into each array item
          const nestedDeletion = await this.recursiveDelete(item, nestedObjectId, visited);
          if (nestedDeletion) return true;
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Traverse objects
        if (obj[key]._id && obj[key]._id.toString() === nestedObjectId) {
          console.log(`Deleting Itinerary nested object with ID: ${nestedObjectId} at key: ${key}`);
          delete obj[key]; // Delete the found object
          return true; // Deletion successful
        }
  
        // Recur into nested objects
        const nestedDeletion = await this.recursiveDelete(obj[key], nestedObjectId, visited);
        if (nestedDeletion) return true;
      }
    }
    return false; // Not found
  }
  
  async createItinerary(itinerary: Itinerary): Promise<Itinerary> {
    try {
     const itineraryData = new this.itineraryModel(itinerary);
      return await itineraryData.save();
    } catch (e) {
      throw new BadRequestException(`Invalid Data format: ${e.message}`);
    }
  }

  async findAllItinerary(): Promise<Itinerary[]> {
    try {
      const allItineraries = await this.itineraryModel.find().exec();
      return allItineraries.map(itinerary => this.replaceId(itinerary.toObject())); 
    } catch (e) {
      throw new BadRequestException(`Could not find itineraries: ${e.message}`);
    }
  }

  async getItineraryById(id: string): Promise<Itinerary> {
    try {
      const existingitinerary = await this.validateLeadIdAndFind(id);
    
      // Apply the replaceId function directly on the single object
      return this.replaceId(existingitinerary.toObject());
    } catch (e) {
      throw new BadRequestException(`Could not find itinerary: ${e.message}`);
    }
  }

  async updateById(id: string, itineraryDto: Itinerary): Promise<{ message: string, updatedItinerary: Itinerary }> {
    
    const existingItinerary = await this.validateLeadIdAndFind(id);
    
    // Update top-level fields
    Object.assign(existingItinerary, itineraryDto); 
  
    await existingItinerary.save();
    
    return {
      message: `Itinerary with ID ${id} was successfully updated.`,
      updatedItinerary: this.replaceId(existingItinerary.toObject())
    };
  }
  
  async updateNestedObject(
    itineraryId: string,
    nestedObjectId: string,
    updateData: any
  ): Promise<{ message: string; updatedObject: any }> {
    try {
      const itinerary = await this.findOne(itineraryId);
      if (!itinerary) {
        throw new NotFoundException(`itinerary with ID ${itineraryId} not found`);
      }
  
      const updatedObject = await this.recursiveUpdate(itinerary, nestedObjectId, updateData);
      if (!updatedObject) {
        throw new NotFoundException(`Itinerary Nested object with ID ${nestedObjectId} not found`);
      }
  
      await itinerary.save();
  
      const successMessage = `Itinerary Nested object with ID ${nestedObjectId} was successfully updated.`;
      return {
        message: successMessage,
        updatedObject,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else if (error instanceof MongooseError) {
        throw new BadRequestException(`Mongoose error: ${error.message}`);
      } else {
        throw new InternalServerErrorException(`Unexpected error: ${error.message}`);
      }
    }
  }
  
  
async deleteLead(itineraryId: string): Promise<{ message: string }>{
  try{
    const result = await this.itineraryModel.deleteOne({ _id: itineraryId }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Itinerary Lead with id ${itineraryId} not found`);
    }
    return {
      message : `Itinerary has been deleted id ${itineraryId}`
    }
  }catch(e){
    throw new BadRequestException(`Invalid Lead ID ${e.message} not found`);
  } 
}

async deleteNestedObject(itineraryId: string, nestedObjectId: string): Promise<{ message: string, itinerary: Itinerary | null }> {
  try {
    const itinerary = await this.itineraryModel.findById(itineraryId);

    if (!itinerary) {
      throw new NotFoundException(`Itinerary with ID ${itineraryId} not found`);
    }
    // Call your recursive deletion method
    const isDeleted = await this.recursiveDelete(itinerary, nestedObjectId);

    if (!isDeleted) {
      // console.log(`Nested object with ID ${nestedObjectId} not found`);
      throw new NotFoundException(`Itinerary Nested object with ID ${nestedObjectId} not found`);
    }
    // Save the updated itinerary after deletion of the nested object
    await itinerary.save();
  
    // Log and return a custom success message along with the updated itinerary
    const successMessage = `Itinerary Nested object with ID ${nestedObjectId} was successfully deleted.`;
    console.log(successMessage);
    
    return { 
      message: successMessage, 
      itinerary 
    };

  } catch (error) {
    console.error(`Error in deleteNestedObject:`, error);
    throw error;
  }
}










}
