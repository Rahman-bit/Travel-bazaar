import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateNewCustomerModule } from './newCustomer/newCustomer.module';
import { MongooseModule } from '@nestjs/mongoose';
import { NewleadModule } from './newlead/newlead.module';

@Module({
  imports: [CreateNewCustomerModule, NewleadModule, MongooseModule.forRoot('mongodb+srv://syed456abdul:Kjie5z1ewYFdbxpr@cluster0.7hm7h.mongodb.net/bazaar?retryWrites=true&w=majority&appName=Cluster0', {
    
  }), ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
