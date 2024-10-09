import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateNewCustomerModule } from './newCustomer/newCustomer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NewleadModule } from './newlead/newlead.module';
import { ItineraryModule } from './itinerary/itinerary.module';
import { InvoiceModule } from './invoice/invoice.module';

@Module({
  imports: [CreateNewCustomerModule, NewleadModule, ItineraryModule, MongooseModule.forRoot('mongodb+srv://syed456abdul:Kjie5z1ewYFdbxpr@cluster0.7hm7h.mongodb.net/bazaar?retryWrites=true&w=majority&appName=Cluster0', { }), InvoiceModule, ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
