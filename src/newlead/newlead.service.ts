import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { NestedItem, NewLead, NewLeadDocument } from './dto/newlead.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, MongooseError, Types } from 'mongoose';
import { ObjectId } from 'mongodb';
import { recursiveUpdate } from 'src/utils/leadupated';
import { validateLeadIdAndFind } from 'src/utils/leadValidation';

@Injectable()
export class NewleadService {

  constructor(@InjectModel('newlead') private newleadModel: Model<NewLeadDocument>) { }

  // async validateLeadIdAndFind(leadId: string): Promise<NewLeadDocument> {

  //   if (!mongoose.Types.ObjectId.isValid(leadId)) {
  //     throw new BadRequestException('Invalid Lead ID format Sayyed');
  //   }

  //   const existingLead = await this.newleadModel.findById(leadId).exec();

  //   if (!existingLead) {
  //     throw new NotFoundException(`Lead with id abdul ${leadId} not found`);
  //   }
  //   return existingLead;
  // }

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

private recursiveUpdate(
  obj: any,
  nestedObjectId: string | ObjectId,
  updateData: any,
  visited = new Set<any>(),
  parent: any = null,
  parentKey: string | number = null
): { updatedItem: any; parent: any; parentKey: string | number } | null {
  // Prevent circular references
  if (visited.has(obj)) {
    return null;
  }
  visited.add(obj);

  // Check if obj is valid
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
            console.log(`Found nested object with ID: ${nestedObjectId} at array index: ${i}, key: ${key}`);

            // Update only the properties in updateData without removing other properties
            Object.assign(item, updateData);
            return { updatedItem: item, parent, parentKey: key };  
          }
        }
        const result = this.recursiveUpdate(item, nestedObjectId, updateData, visited, obj[key], i);
        if (result) return result; // If found, return it
      }
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      // Ensure obj[key]._id and nestedObjectId are valid ObjectId strings
      if (obj[key]._id && ObjectId.isValid(obj[key]._id) && ObjectId.isValid(nestedObjectId)) {
        // Convert obj[key]._id and nestedObjectId to ObjectId before comparison
        if (new ObjectId(obj[key]._id).equals(new ObjectId(nestedObjectId))) {
          console.log(`Found nested object with ID: ${nestedObjectId} at key: ${key}`);

          // Update only the properties in updateData without removing other properties
          Object.assign(obj[key], updateData);
          return { updatedItem: obj[key], parent: obj, parentKey: key };  // Return the updated object and its parent
        }
      }
      // Recur into nested objects
      const result = this.recursiveUpdate(obj[key], nestedObjectId, updateData, visited, obj, key);
      if (result) return result; // If found, return it
    }
  }
  return null;  // Return null if no match is found
}


  // POST request
  async create(leadDto: NewLeadDocument): Promise<NewLeadDocument> {
    try {
      const newLead = new this.newleadModel(leadDto);
      // console.log("Lead object to be saved:", newLead);
      return await newLead.save();
    } catch (e) {
      // console.error("Error during lead creation:", e);
      throw new BadRequestException(`Invalid Data format: ${e.message}`);
    }
  }
  // POST request for add new nested Objects in 
async addNestedItem(leadId: string, nestedItem: string, newItemData: NestedItem) {

    const existingLead = await validateLeadIdAndFind(leadId, this.newleadModel);

    if (!existingLead[nestedItem]) {
      throw new BadRequestException(`Invalid nested item: ${nestedItem}`);
    }
    if (nestedItem === 'serviceList') {
      existingLead.serviceList.push(newItemData);
    } else if (nestedItem === 'invoice') {
      existingLead.invoice.push(newItemData);
    } else if (nestedItem === 'itinerary') {
      existingLead.itinerary.push(newItemData);
    } else {
      throw new BadRequestException(`Unknown nested item: ${nestedItem}`);
    }
    return existingLead.save();
  }

// GET request Find All Leads 
async findAll(): Promise<any[]> {
  try {
    const allLeads = await this.newleadModel.find().exec();
    const formateNestedObjects = (array: any[]) => {
      return array.map(item => {
        return {
          serviceName: item.serviceName,
          isChecked: item.isChecked, 
          id: item._id,
          _id: undefined,
        };
      });
    };
    
    return allLeads.map((lead: NewLeadDocument) => {
      return {
        id: lead._id,
        uniqueNumber: lead.uniqueNumber,
        createdDate: lead.createdDate,
        leadTitle: lead.leadTitle,
        paymentmode: lead.paymentmode,
        customerName: lead.customerName,
        getRequirement: lead.getRequirement,
        noOfInfants: lead.noOfInfants,
        typeOfHoliday: lead.typeOfHoliday,
        dateANDtime: lead.dateANDtime,
        pickUpPoint: lead.pickUpPoint,
        dropPoint: lead.dropPoint,
        noOfAdults: lead.noOfAdults,
        noOfKids: lead.noOfKids,
        groupTourPackageList: lead.groupTourPackageList,
        vehicleType: lead.vehicleType,
        noOfRooms: lead.noOfRooms,
        startDate: lead.startDate,
        endDate: lead.endDate,
        checkIN: lead.checkIN,
        checkOUT: lead.checkOUT,
        destination: lead.destination,
        country: lead.country,
        noOfDays: lead.noOfDays,
        typeOfVisa: lead.typeOfVisa,
        coupleList: lead.coupleList,
        currencyType: lead.currencyType,
        budgetForTrip: lead.budgetForTrip,
        requiredDocuments: lead.requiredDocuments,
        shortNote: lead.shortNote,
        hotelPreferences: lead.hotelPreferences,
        leadstatus: lead.leadstatus,
        serviceList: formateNestedObjects(lead.serviceList),
        invoice: formateNestedObjects(lead.invoice),
        itinerary: formateNestedObjects(lead.itinerary),
      };
    });
  } catch (e) {
    throw new BadRequestException(`Could not find Lead: ${e.message}`);
  }
}

// GET request with ID find single Leads 
  async findOne(id: string) {
      try {
        const lead = await validateLeadIdAndFind(id, this.newleadModel);
        if (!lead) throw new NotFoundException(' Could not found product');
        return this.replaceId(lead.toObject());
      } catch (error) {
        throw new BadRequestException(' Could not found lead', error)
      }
  }

// PUT request with ID
  async update(id: string, updateNewlead: NewLead): Promise<{ message: string, updatedItinerary: NewLead }> {
  
    const existingLead = await validateLeadIdAndFind(id, this.newleadModel);
     // Update top-level fields
     Object.assign(existingLead, updateNewlead); 
     await existingLead.save();
    
    return {
      message: `Lead with ID ${id} was successfully updated.`,
      updatedItinerary: this.replaceId(existingLead.toObject())
    };
  }

  //PUT request update nested items with ID
  async updateNestedItem(leadId: string, nestedObjectId: string, updateData: any) {
    try {
        const existingLead = await validateLeadIdAndFind(leadId, this.newleadModel);
        
        const result = recursiveUpdate(existingLead, nestedObjectId, updateData);
        
        if (!result) {
            throw new NotFoundException(`Lead Nested object with ID ${nestedObjectId} not found`);
        }

        const { updatedItem } = result;

        // Save the parent document to persist changes in nested objects
        await existingLead.save();

        const successMessage = `Lead Nested object with ID ${nestedObjectId} was successfully updated.`;
        return {
            message: successMessage,
            updatedItem
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
  
  //DELETE request delete entire lead 
  async deleteLead(leadId: string): Promise<{ message: string }> {
    try{
      const result = await this.newleadModel.deleteOne({ _id: leadId }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Lead with id ${leadId} not found`);
      }
      return {
        message : `Lead has been deleted id ${leadId}`
      }
    }catch(e){
      throw new BadRequestException(`Invalid Lead ID ${e.message} not found`);
    }
  }

  // DELETE request with ID delete Nested Items 
  async deleteNestedItem(leadId: string, nestedItem: string, nestedItemId: string) {
    try{
        const existingLead = await validateLeadIdAndFind(leadId, this.newleadModel);
        if (!existingLead[nestedItem]) {
          throw new BadRequestException(`Invalid nested item: ${nestedItem}`);
        }
        // Generic function to delete nested array item by ID
        const deleteNestedArrayItem = (arrayName: string) => {
          const array = existingLead[arrayName];
          const itemIndex = array.findIndex((item: NestedItem) => item._id.toString() === nestedItemId);

          if (itemIndex !== -1) {
            array.splice(itemIndex, 1);
          } else {
            throw new NotFoundException(`${arrayName.slice(0, -1)} with id ${nestedItemId} not found in ${arrayName}`);
          }
        };

        const deleteMap = {
          serviceList: existingLead.serviceList,
          invoice: existingLead.invoice,
          itinerary: existingLead.itinerary,
        };

        if (deleteMap[nestedItem]) {
          deleteNestedArrayItem(nestedItem);
        } else {
          throw new BadRequestException(`Invalid nested item: ${nestedItem}`);
        }

        await existingLead.save();

          return {
            message: `${nestedItem} ID ${leadId} deleted successfully`,
          };
        
      } catch (error) {
        throw new InternalServerErrorException('An error occurred while deleting the nested item.');
      }
  }
}
