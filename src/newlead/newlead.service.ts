import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { NestedItem, NewLead, NewLeadDocument } from './dto/newlead.dto';
import { UpdateNewleadDto } from './dto/update-newlead.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';

@Injectable()
export class NewleadService {

  constructor(@InjectModel('newlead') private newleadModel: Model<NewLeadDocument>) { }

  async validateLeadIdAndFind(leadId: string): Promise<NewLeadDocument> {

    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      throw new BadRequestException('Invalid Lead ID format Sayyed');
    }

    const existingLead = await this.newleadModel.findById(leadId).exec();

    if (!existingLead) {
      throw new NotFoundException(`Lead with id abdul ${leadId} not found`);
    }
    return existingLead;
  }

  // POST request
  create(newLead: NewLead) {
      try{
       const newUser = new this.newleadModel({
            ...newLead,
            serviceList: [...newLead.serviceList],
            invoice: [...newLead.invoice],
            itinerary: [...newLead.itinerary]
          });
          
        return newUser.save();
      }catch(e){
        throw new BadRequestException(`Invalid Data format ${e.message}`);
      }
  }
  // POST request for add new nested Objects in 
async addNestedItem(leadId: string, nestedItem: string, newItemData: NestedItem) {

    const existingLead = await this.validateLeadIdAndFind(leadId);

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
        // const lead = await this.newleadModel.findById(id).exec();
        const lead = await this.validateLeadIdAndFind(id);
        if (!lead) throw new NotFoundException(' Could not found product');
        return lead;
      } catch (error) {
        throw new NotFoundException(' Could not found lead', error)
      }
  }

// PUT request with ID
  async update(id: string, updateNewlead: NewLead) {
  
    const existingLead = await this.validateLeadIdAndFind(id);
    // Update main fields 
    existingLead.uniqueNumber = updateNewlead.uniqueNumber || existingLead.uniqueNumber;
    existingLead.createdDate = updateNewlead.createdDate || existingLead.createdDate;
    existingLead.leadTitle = updateNewlead.leadTitle || existingLead.leadTitle;
    existingLead.paymentmode = updateNewlead.paymentmode || existingLead.paymentmode;
    existingLead.customerName = updateNewlead.customerName || existingLead.customerName;
    existingLead.getRequirement = updateNewlead.getRequirement || existingLead.getRequirement;
    existingLead.noOfInfants = updateNewlead.noOfInfants || existingLead.noOfInfants;
    existingLead.typeOfHoliday = updateNewlead.typeOfHoliday || existingLead.typeOfHoliday;
    existingLead.dateANDtime = updateNewlead.dateANDtime || existingLead.dateANDtime;
    existingLead.pickUpPoint = updateNewlead.pickUpPoint || existingLead.pickUpPoint;
    existingLead.dropPoint = updateNewlead.dropPoint || existingLead.dropPoint;
    existingLead.noOfAdults = updateNewlead.noOfAdults || existingLead.noOfAdults;
    existingLead.noOfKids = updateNewlead.noOfKids || existingLead.noOfKids;
    existingLead.groupTourPackageList = updateNewlead.groupTourPackageList || existingLead.groupTourPackageList;
    existingLead.vehicleType = updateNewlead.vehicleType || existingLead.vehicleType;
    existingLead.noOfRooms = updateNewlead.noOfRooms || existingLead.noOfRooms;
    existingLead.startDate = updateNewlead.startDate || existingLead.startDate;
    existingLead.endDate = updateNewlead.endDate || existingLead.endDate;
    existingLead.checkIN = updateNewlead.checkIN || existingLead.checkIN;
    existingLead.checkOUT = updateNewlead.checkOUT || existingLead.checkOUT;
    existingLead.destination = updateNewlead.destination || existingLead.destination;
    existingLead.country = updateNewlead.country || existingLead.country;
    existingLead.noOfDays = updateNewlead.noOfDays || existingLead.noOfDays;
    existingLead.typeOfVisa = updateNewlead.typeOfVisa || existingLead.typeOfVisa;
    existingLead.coupleList = updateNewlead.coupleList || existingLead.coupleList;
    existingLead.currencyType = updateNewlead.currencyType || existingLead.currencyType;
    existingLead.budgetForTrip = updateNewlead.budgetForTrip || existingLead.budgetForTrip;
    existingLead.requiredDocuments = updateNewlead.requiredDocuments || existingLead.requiredDocuments;
    existingLead.shortNote = updateNewlead.shortNote || existingLead.shortNote;
    existingLead.hotelPreferences = updateNewlead.hotelPreferences || existingLead.hotelPreferences;
    existingLead.leadstatus = updateNewlead.leadstatus || existingLead.leadstatus;

    return existingLead.save();
  }

  //PUT request update nested items with ID
  // {"serviceName": "Updated invoice Name","isChecked": false}
  async updateNestedItem(leadId: string, nestedItem: string, nestedItemId: string, updateData: any) {
    
    try {
        const existingLead = await this.validateLeadIdAndFind(leadId);
        const nestedArray = existingLead[nestedItem];
        if (!Array.isArray(nestedArray)) {
            throw new BadRequestException(`Invalid nested item: ${nestedItem} is not an array`);
        }
        const itemIndex = nestedArray.findIndex((item: NestedItem) => item._id.toString() === nestedItemId);
        if (itemIndex === -1) {
            throw new NotFoundException(`${nestedItem.slice(0, -1)} with id ${nestedItemId} not found`);
        }
        // Update only the fields that are provided in updateData
        const existingItem = nestedArray[itemIndex];
        for (const key in updateData) {
            if (updateData.hasOwnProperty(key)) {
                existingItem[key] = updateData[key];
            }
        }
        await existingLead.save();
        return {
            message: `${nestedItem.slice(0, -1)} updated successfully`,
            updatedItem: existingItem
        };
    } catch (error) {
        throw new InternalServerErrorException('An error occurred while updating the nested item.');
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
        const existingLead = await this.validateLeadIdAndFind(leadId);
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
