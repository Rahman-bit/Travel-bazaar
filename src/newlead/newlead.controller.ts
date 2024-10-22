import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { NewleadService } from './newlead.service';
import { NestedItem, NewLead, NewLeadDocument } from './dto/newlead.dto';

@Controller('newlead')
export class NewleadController {
  constructor(private readonly newleadService: NewleadService) {}
// http://localhost:3000/newlead
  @Post()
  async create(@Body() leadDto: NewLeadDocument):Promise<NewLead> {
      // console.log("leadDto:", leadDto)
      return await this.newleadService.create(leadDto);
    }

  // http://localhost:3000/newlead/:leadId/itinerary
  @Post(':leadId/:nestedItem')
    async addNestedItem(
      @Param('leadId') leadId: string,
      @Param('nestedItem') nestedItem: string,
      @Body() newItemData: NestedItem
    ){
      return await this.newleadService.addNestedItem(leadId, nestedItem, newItemData);
  }
    
 // http://localhost:3000/newlead
  @Get()
  async findAll() {
    const result = await this.newleadService.findAll();
    return result
  }

  // http://localhost:3000/newlead/66e16da154ed705c44327faa
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.newleadService.findOne(id);
  }

  // URL for PUT request to update lead
  // http://localhost:3000/newlead/66e16da154ed705c44327faa
  @Put(':id')
  update(@Param('id') id: string, @Body() updateNewleadDto: NewLead) {
    return this.newleadService.update(id, updateNewleadDto);
  }

  // URL for PUT request to update nested array of objects
  // http://localhost:3000/newlead/66e16da154ed705c44327faa/itinerary/66e16da154ed705c44327fb2
  @Put(':leadId/:nestedItemId')
  async updateNestedItem(
    @Param('leadId') leadId: string,
    @Param('nestedItemId') nestedObjectId: string,
    @Body() updateData: NewLead
  ) {
    return this.newleadService.updateNestedItem(leadId, nestedObjectId, updateData);
  }

  // DELETE request to delete an entire lead by ID
  @Delete(':leadId')
    async deleteLead(@Param('leadId') leadId: string): Promise<{ message: string}> {
      return this.newleadService.deleteLead(leadId);
  }

  @Delete(':leadId/:nestedItem/:nestedItemId')
  deleteNestedItem(
    @Param('leadId') leadId: string,
    @Param('nestedItem') nestedItem: string,
    @Param('nestedItemId') nestedItemId: string,
  ) {

    return this.newleadService.deleteNestedItem(leadId, nestedItem, nestedItemId);
  }
}
