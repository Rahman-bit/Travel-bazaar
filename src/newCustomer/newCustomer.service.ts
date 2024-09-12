import { Injectable, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from './dto/newCustomer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class createNewCustomerService {
  constructor(@InjectModel('Customer') private newCustomerModel: Model<UserDocument>) {}
  
  async create(newLead: User): Promise<User> {
    // const newUser = new this.newCustomerModel(newLead)
    // const result = await newUser.save();
    // // console.log("Result :", result);
    // return result;
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

  async updateLead(id: string, updateLeadDto: User): Promise<User> {
    const updatedLead = await this.newCustomerModel
      .findByIdAndUpdate(id, updateLeadDto, { new: true })
      .exec();
    
    if (!updatedLead) {
      throw new NotFoundException('Could not find the lead to update');
    }

    return updatedLead;
  }

  async updateUser(id: string, updateCreateleadDto: User) {

    const userData = await this.newCustomerModel.findById(id);
    
    if(updateCreateleadDto.customerFirstName) userData.customerFirstName = updateCreateleadDto.customerFirstName;
    if(updateCreateleadDto.customerLastName) userData.customerLastName = updateCreateleadDto.customerLastName;
    if(updateCreateleadDto.customerEmail) userData.customerEmail = updateCreateleadDto.customerEmail;
    if(updateCreateleadDto.customerMobile) userData.customerMobile = updateCreateleadDto.customerMobile;
    if(updateCreateleadDto.country) userData.country = updateCreateleadDto.country;
    if(updateCreateleadDto.createdDate) userData.createdDate = updateCreateleadDto.createdDate;
    if(updateCreateleadDto.state) userData.state = updateCreateleadDto.state;
    if(updateCreateleadDto.city) userData.city = updateCreateleadDto.city;
    if(updateCreateleadDto.zipcode) userData.zipcode = updateCreateleadDto.zipcode;

    userData.save();
    return `User Data has been updated with Id : ${id}`;
  }

 async deleteLead(id: string) {
    const product = await this.newCustomerModel.deleteOne({_id : id}).exec();
    if(product.deletedCount === 0) throw new NotFoundException(" Could not found lead")
    return `This action removes a #${id} lead`;
  }
}
