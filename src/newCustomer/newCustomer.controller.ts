import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Put } from '@nestjs/common';
import { createNewCustomerService } from './newCustomer.service';
import { User } from './dto/newCustomer.dto';
// import { UpdateCreateleadDto } from './dto/update-createlead.dto';

@Controller('newcustomer')
export class CreateNewCustomerController {
  
  constructor(private readonly createCustomerService: createNewCustomerService) {}

  @Post()
  async create(@Body() createCreateleadDto: User) {
     const data = await this.createCustomerService.create(createCreateleadDto);
     return data;
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
    try {
      const updatedData = await this.createCustomerService.updateData(id, updateLeadDto);

      return {
        message: `Lead/User with ID: ${id} has been successfully updated`,
        updatedData: updatedData, 
      };
    } catch (error) {
      throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'Failed to update lead/user data',
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }



  @Delete(':id')
 async remove(@Param('id') id: string) {
     await this.createCustomerService.deleteLead(id);
    //  console.log('deleeted lead:', id)
     return `This action removes a #${id} lead`;
  }
}
