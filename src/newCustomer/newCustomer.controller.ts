import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Put } from '@nestjs/common';
import { createNewCustomerService } from './newCustomer.service';
import { User } from './dto/newCustomer.dto';
// import { UpdateCreateleadDto } from './dto/update-createlead.dto';

@Controller('newcustomer')
export class CreateNewCustomerController {
  
  constructor(private readonly createCustomerService: createNewCustomerService) {}

  @Post()
  async create(@Body() createCreateleadDto: User) {
     const result = await this.createCustomerService.create(createCreateleadDto);
     return result;
  }

  @Get()
  async findAll() {
    const allUsers = await this.createCustomerService.findAllUsers();
    return allUsers;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.createCustomerService.findUser(id);
  }

  @Put(':id')
  async updateLead(@Param('id') id: string, @Body() updateLeadDto: User) {
    return await this.createCustomerService.updateLead(id, updateLeadDto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateCreateleadDto: User) {
    try{
      await this.createCustomerService.updateUser(id, updateCreateleadDto);
     }catch(error){
      throw new HttpException({
          status : HttpStatus.FORBIDDEN,
          error : 'somthing goes wrong in server'
      },
      HttpStatus.FORBIDDEN,
          {
              cause : error
          }
      )
  }
    return `Lead has been upate with ID :${id}`;
  }

  @Delete(':id')
 async remove(@Param('id') id: string) {
     await this.createCustomerService.deleteLead(id);
    //  console.log('deleeted lead:', id)
     return `This action removes a #${id} lead`;
  }
}
