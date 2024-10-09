import { PartialType } from '@nestjs/mapped-types';
import { CreateNewleadDto } from './create-newlead.dto';

export class UpdateNewleadDto extends PartialType(CreateNewleadDto) {}


