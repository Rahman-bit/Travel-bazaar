import { Module } from '@nestjs/common';
import { createNewCustomerService } from './newCustomer.service';
import { CreateNewCustomerController } from './newCustomer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from './entities/newCustomer.entity';

@Module({
  imports : [ MongooseModule.forFeature([{ name: 'Customer', schema: CustomerSchema }])],
  controllers: [CreateNewCustomerController],
  providers: [createNewCustomerService],
})
export class CreateNewCustomerModule {}
