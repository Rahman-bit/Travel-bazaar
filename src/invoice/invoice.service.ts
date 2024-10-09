import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Invoice, NestedItem } from './dto/invoice.dto';
// import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class InvoiceService {

  constructor(@InjectModel('invoice') private invoiceModel: Model<Invoice>) {}

  async create(invoiceData: Invoice): Promise<Invoice> {
     const invoice = new this.invoiceModel({
      ...invoiceData,
      createdDate: new Date().toISOString(),
      updatedAt: new Date(),
    });
    return invoice.save();
  }

  async addNestedItem(invoiceId: string, nestedItem: string, newItemData: NestedItem): Promise<Invoice> { // Change to NestedItem

    if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
        throw new BadRequestException('Invalid Invoice ID format');
    }
    const existingLead = await this.invoiceModel.findById(invoiceId).exec();
    if (!existingLead) {
        throw new NotFoundException(`Invoice with id ${invoiceId} not found`);
    }
    if (!existingLead[nestedItem]) {
        throw new BadRequestException(`Invalid nested item: ${nestedItem}`);
    }
    if (!Array.isArray(existingLead[nestedItem])) {
        throw new BadRequestException(`Invalid nested item: ${nestedItem} is not an array`);
    }

    if (nestedItem === 'invoiceParticulars') {
        existingLead.invoiceParticulars.push({
            id: newItemData._id ? newItemData._id.toString() : undefined,
            item: newItemData.item,
            amount: newItemData.amount,
        });
    } else {
        throw new BadRequestException(`Unknown nested item: ${nestedItem}`);
    }
    await existingLead.save();
    return existingLead; 
}

async findAll() {
    let allInvoiceData;
    try{
      allInvoiceData = await this.invoiceModel.find().exec();
    }catch(e){
      throw new BadRequestException(`Could not found Lead ${e.message}`);
    }

    return allInvoiceData.map((invoice)=> ({
          id : invoice._id,
          currencyType : invoice.currencyType,
          paymentMode : invoice.paymentMode,
          global_id : invoice.global_id,
          customerName : invoice.customerName,
          invoieStatus : invoice.invoieStatus,
          invoiceParticulars : invoice.invoiceParticulars.map(particular => ({
            id: particular._id,
            item: particular.item,
            amount: particular.amount,
          })),
          grandTotalAmount : invoice.grandTotalAmount,
          gstNumber : invoice.gstNumber,
          panNumber : invoice.panNumber,
          billingNote : invoice.billingNote,
          invoiceId : invoice.invoiceId,
          createdDate : invoice.createdDate,
          invoiceType : invoice.invoiceType
    }))
  }

  async findOne(id: string) {
    let invoice;
      try{
          invoice = await this.invoiceModel.findById({_id : id}).exec();
      }catch(error){
            throw new NotFoundException(' Could not found product', error)
      }
        if(!invoice) throw new NotFoundException(' Could not found product');

    return {
              id : invoice.id,
              currencyType : invoice.currencyType,
              paymentMode : invoice.paymentMode,
              global_id : invoice.global_id,
              customerName : invoice.customerName,
              invoieStatus : invoice.invoieStatus,
              invoiceParticulars :invoice.invoiceParticulars.map(particular => ({
                id: particular._id,
                item: particular.item,
                amount: particular.amount,
              })), 
              grandTotalAmount : invoice.grandTotalAmount,
              gstNumber : invoice.gstNumber,
              panNumber : invoice.panNumber,
              billingNote : invoice.billingNote,
              invoiceId : invoice.invoiceId,
              createdDate : invoice.createdDate,
              invoiceType : invoice.invoiceType   
          };
  }

async update(id: string, updateInvoice: Invoice) {
   
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid Lead ID format');
  }
  const existingInvoice = await this.invoiceModel.findById({_id:id}).exec();
  if (!existingInvoice) {
      throw new NotFoundException(`Lead with id ${id} not found`);
  }

  if (updateInvoice.currencyType) existingInvoice.currencyType = updateInvoice.currencyType;
  if (updateInvoice.paymentMode) existingInvoice.paymentMode = updateInvoice.paymentMode;
  if (updateInvoice.global_id) existingInvoice.global_id = updateInvoice.global_id;
  if (updateInvoice.customerName) existingInvoice.customerName = updateInvoice.customerName;
  if (updateInvoice.invoieStatus) existingInvoice.invoieStatus = updateInvoice.invoieStatus;
  if (updateInvoice.invoiceParticulars) existingInvoice.invoiceParticulars = updateInvoice.invoiceParticulars;
  if (updateInvoice.grandTotalAmount) existingInvoice.grandTotalAmount = updateInvoice.grandTotalAmount;
  if (updateInvoice.gstNumber) existingInvoice.gstNumber = updateInvoice.gstNumber;
  if (updateInvoice.panNumber) existingInvoice.panNumber = updateInvoice.panNumber;
  if (updateInvoice.billingNote) existingInvoice.billingNote = updateInvoice.billingNote;
  if (updateInvoice.invoiceId) existingInvoice.invoiceId = updateInvoice.invoiceId;
  if (updateInvoice.createdDate) existingInvoice.createdDate = updateInvoice.createdDate;
  if (updateInvoice.invoiceType) existingInvoice.invoiceType = updateInvoice.invoiceType;
  
    await existingInvoice.save();
    const updatedLead = await this.invoiceModel.findByIdAndUpdate(id, updateInvoice, { new: true }).exec();
  
    if (!updatedLead) {
      throw new NotFoundException('Could not find the lead to update');
    }
    return updatedLead;
  }

  //PUT request update nested items with ID
  // {"invoiceParticulars": []}
  async updateNestedItem(invoiceId: string, nestedItem: string, nestedItemId: string, updateData: any) {
    
    try {
        const existingLead = await this.invoiceModel.findById(invoiceId).exec();
        if (!existingLead) {
            throw new NotFoundException(`Invoice with id ${invoiceId} not found`);
        }
        const nestedArray = existingLead[nestedItem];
        if (!Array.isArray(nestedArray)) {
            throw new BadRequestException(`Invalid nested item: ${nestedItem} is not an array`);
        }
        const itemIndex = nestedArray.findIndex((item: NestedItem) => item._id.toString() === nestedItemId);
        if (itemIndex === -1) {
            throw new NotFoundException(`${nestedItem.slice(0, -1)} with id ${nestedItemId} not found`);
        }
        const existingItem = nestedArray[itemIndex];

        for (const key in updateData) {
            if (updateData.hasOwnProperty(key)) {
                existingItem[key] = updateData[key];
            }
        }
        await existingLead.save();
        return {
            message: `${nestedItem.slice(0, -1)} updated successfully`,
            updatedInvoice: {
                ...existingLead.toObject(), 
            },
        };
    } catch (error) {
        console.error('Error updating nested item:', error); 
        throw new InternalServerErrorException('An error occurred while updating the nested item.');
    }
}
  //DELETE request delete entire lead 
  async deleteLead(invoiceId: string): Promise<{ message: string }> {
    
    try{
      const result = await this.invoiceModel.deleteOne({ _id: invoiceId }).exec();
      if (result.deletedCount === 0) {
        throw new NotFoundException(`Lead with id ${invoiceId} not found`);
      }
      return {
        message : `Lead has been deleted id ${invoiceId}`
      }
    }catch(e){
      throw new BadRequestException(`Invalid Lead ID ${e.message} not found`);
    }
  }

  // DELETE request with ID delete Nested Items 
  async deleteNestedItem(invoiceId: string, nestedItem: string, nestedItemId: string) {
   
    try {
        if (!mongoose.Types.ObjectId.isValid(invoiceId)) {
            throw new BadRequestException('Invalid Invoice ID format');
        }
        const existingInvoice = await this.invoiceModel.findById(invoiceId).exec();
        if (!existingInvoice) {
            throw new NotFoundException(`Invoice with id ${invoiceId} not found`);
        }
        const nestedArray = existingInvoice[nestedItem];
        if (!Array.isArray(nestedArray)) {
            throw new BadRequestException(`Invalid nested item: ${nestedItem} is not an array`);
        }
        const itemIndex = nestedArray.findIndex((item: NestedItem) => item._id.toString() === nestedItemId);
        if (itemIndex === -1) {
            throw new NotFoundException(`${nestedItem.slice(0, -1)} with id ${nestedItemId} not found`);
        }
        nestedArray.splice(itemIndex, 1);
        await existingInvoice.save();

        return {
            message: `${nestedItem.slice(0, -1)} with ID ${nestedItemId} deleted successfully`,
        };
    } catch (error) {
        console.error('Error deleting nested item:', error);
        throw new InternalServerErrorException('An error occurred while deleting the nested item.');
    }
  }

}
