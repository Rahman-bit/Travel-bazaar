import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Put } from '@nestjs/common';
import { CreateleadService } from './createlead.service';
import { User } from './dto/create-createlead.dto';
// import { UpdateCreateleadDto } from './dto/update-createlead.dto';

@Controller('createLead')
export class CreateleadController {
  constructor(private readonly createleadService: CreateleadService) {}

  @Post()
  async create(@Body() createCreateleadDto: User) {
     const result = await this.createleadService.create(createCreateleadDto);
     return result;
  }

  @Get()
  async findAll() {
    const allUsers = await this.createleadService.findAllUsers();
    return allUsers;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.createleadService.findUser(id);
  }

  @Put(':id')
  async updateLead(@Param('id') id: string, @Body() updateLeadDto: User) {
    return await this.createleadService.updateLead(id, updateLeadDto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCreateleadDto: User) {
    try{
      await this.createleadService.updateUser(id, updateCreateleadDto);
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
     await this.createleadService.deleteLead(id);
    //  console.log('deleeted lead:', id)
     return `This action removes a #${id} lead`;
  }
}
