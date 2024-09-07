import { Module } from '@nestjs/common';
import { CreateleadService } from './createlead.service';
import { CreateleadController } from './createlead.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { LeadSchema } from './entities/createlead.entity';

@Module({
  imports : [MongooseModule.forFeature([{name : 'create new leads', schema : LeadSchema }])],
  controllers: [CreateleadController],
  providers: [CreateleadService],
})
export class CreateleadModule {}
