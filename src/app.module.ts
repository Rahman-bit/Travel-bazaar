import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateNewCustomerModule } from './newCustomer/newCustomer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NewleadModule } from './newlead/newlead.module';
import { ItineraryModule } from './itinerary/itinerary.module';
import { InvoiceModule } from './invoice/invoice.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    CreateNewCustomerModule,
    NewleadModule, 
    ItineraryModule, 
    MongooseModule.forRoot(process.env.MONGOOSE_URL),
    InvoiceModule ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
