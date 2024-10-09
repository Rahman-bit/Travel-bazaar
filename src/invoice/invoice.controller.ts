import { Controller, Get, Post, Body, Patch, Param, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { Invoice, NestedItem } from './dto/invoice.dto';
// import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoice')
export class InvoiceController {

  constructor(private readonly invoiceService: InvoiceService) {}

  @Post()
  async create(@Body() invoiceData: Invoice) {
    const data = await this.invoiceService.create(invoiceData);
    return data;
  }

  // http://localhost:3000/newlead/:leadId/itinerary
  @Post(':leadId/:nestedItem')
    async addNestedItem(
      @Param('leadId') leadId: string,
      @Param('nestedItem') nestedItem: string,
      @Body() newItemData: NestedItem
    ):Promise<Invoice>{
      return await this.invoiceService.addNestedItem(leadId, nestedItem, newItemData);
  }

  @Get()
  async findAll() {
    const allData = await this.invoiceService.findAll();
    return allData;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.invoiceService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateInvoiceDto: Invoice) {
    try {
      const updatedData = await this.invoiceService.update(id, updateInvoiceDto);

      return {
        message: `Invoice Lead with ID: ${id} has been successfully updated`,
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

  // URL for PUT request to update nested array of objects
  // http://localhost:3500/invoice/67025a5eb7792f6436477fe5/invoiceParticulars/67025a93b7792f6436478003
  @Put(':leadId/:nestedItem/:nestedItemId')
  async updateNestedItem(
    @Param('leadId') leadId: string,
    @Param('nestedItem') nestedItem: string,
    @Param('nestedItemId') nestedItemId: string,
    @Body() updateData: Invoice
  ) {
    return this.invoiceService.updateNestedItem(leadId, nestedItem, nestedItemId, updateData);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<{ message: string }> {
    return this.invoiceService.deleteLead(id);
  }

  @Delete(':leadId/:nestedItem/:nestedItemId')
  deleteNestedItem(
    @Param('leadId') leadId: string,
    @Param('nestedItem') nestedItem: string,
    @Param('nestedItemId') nestedItemId: string,
  ) {

    return this.invoiceService.deleteNestedItem(leadId, nestedItem, nestedItemId);
  }
}
