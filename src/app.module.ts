import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CreateleadModule } from './createlead/createlead.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [CreateleadModule, MongooseModule.forRoot('mongodb+srv://syed456abdul:Kjie5z1ewYFdbxpr@cluster0.7hm7h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    
  }), ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
