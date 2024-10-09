import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './dto/newCustomer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class createNewCustomerService {
  constructor(@InjectModel('Customer') private newCustomerModel: Model<UserDocument>) {}
  
  async create(newLead: User): Promise<User> {
  
    const newUser = new this.newCustomerModel({
      ...newLead,
      createdDate: new Date().toISOString(),
      updatedAt: new Date(),
    });
    return newUser.save();
  }

  async findAllUsers() {
    const allLeads = await this.newCustomerModel.find().exec();
    // console.log("allLeads :", allLeads);
    return allLeads.map((user)=>({
              id : user.id,
              customerFirstName : user.customerFirstName,
              customerLastName : user.customerLastName,
              customerEmail : user.customerEmail,
              customerMobile : user.customerMobile,
              createdDate: new Date().toLocaleString(),
              country : user.country,
              state : user.state,
              city : user.city,
              zipcode : user.zipcode
    }))
  }

  async findUser(id: string) {
    let user;
      try{
          user = await this.newCustomerModel.findById(id).exec();
          //  console.log("user Find:", user)
      }catch(error){
            throw new NotFoundException(' Could not found product', error)
      }
        if(!user) throw new NotFoundException(' Could not found product');
        // console.log("user Find:", user)
    return {
              id : user.id,
              customerFirstName : user.customerFirstName,
              customerLastName : user.customerLastName,
              customerEmail : user.customerEmail,
              customerMobile : user.customerMobile,
              createdDate: new Date().toISOString(),
              country : user.country,
              state : user.state,
              city : user.city,
              zipcode : user.zipcode
          };
  }

  async updateData(id: string, updateDto: User): Promise<User | string> {
    const existingData = await this.newCustomerModel.findById({_id : id});
  
    if (!existingData) {
      throw new NotFoundException('Could not find the document to update');
    }
  
    if (
      updateDto.customerFirstName || 
      updateDto.customerLastName || 
      updateDto.customerEmail || 
      updateDto.customerMobile
    ) {
      if (updateDto.customerFirstName) existingData.customerFirstName = updateDto.customerFirstName;
      if (updateDto.customerLastName) existingData.customerLastName = updateDto.customerLastName;
      if (updateDto.customerEmail) existingData.customerEmail = updateDto.customerEmail;
      if (updateDto.customerMobile) existingData.customerMobile = updateDto.customerMobile;
      if (updateDto.country) existingData.country = updateDto.country;
      if (updateDto.createdDate) existingData.createdDate = updateDto.createdDate;
      if (updateDto.state) existingData.state = updateDto.state;
      if (updateDto.city) existingData.city = updateDto.city;
      if (updateDto.zipcode) existingData.zipcode = updateDto.zipcode;
  
      await existingData.save();
      return `User data has been updated with Id: ${id}`;
    }

    const updatedLead = await this.newCustomerModel.findByIdAndUpdate(id, updateDto, { new: true }).exec();
  
    if (!updatedLead) {
      throw new NotFoundException('Could not find the lead to update');
    }
  
    return updatedLead;
  }
  
 async deleteLead(id: string) {
    const product = await this.newCustomerModel.deleteOne({_id : id}).exec();
    if(product.deletedCount === 0) throw new NotFoundException(" Could not found lead")
    return `This action removes a #${id} lead`;
  }
}
