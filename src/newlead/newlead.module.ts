import { Module } from '@nestjs/common';
import { NewleadService } from './newlead.service';
import { NewleadController } from './newlead.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { NewLeadSchema } from './entities/newlead.entity';

@Module({
  imports : [ MongooseModule.forFeature([{ name: 'newlead', schema: NewLeadSchema }])],
  controllers: [NewleadController],
  providers: [NewleadService],
})
export class NewleadModule {}
